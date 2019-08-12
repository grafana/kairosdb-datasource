package kairos

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"github.com/zsabin/kairosdb-datasource/pkg/panel"
	"golang.org/x/net/context"
	"golang.org/x/net/context/ctxhttp"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io/ioutil"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Datasource struct {
	plugin.NetRPCUnsupportedPlugin
	Logger hclog.Logger
}

func (ds *Datasource) Query(ctx context.Context, request *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	req, err := ds.CreateQuery(request)
	if err != nil {
		return nil, err
	}

	bytes, err := ds.MakeHttpRequest(ctx, req, request.Datasource.Url)
	if err != nil {
		return nil, err
	}

	datasourceResponse, err := ds.ParseResponse(bytes)
	if err != nil {
		return nil, err
	}

	return datasourceResponse, nil
}

func (ds *Datasource) CreateQuery(request *datasource.DatasourceRequest) (*Request, error) {
	var queries []*MetricQuery
	//var queries []panel.MetricQuery

	for _, dsQuery := range request.Queries {
		panelRequest := &panel.MetricRequest{}
		err := json.Unmarshal([]byte(dsQuery.ModelJson), panelRequest)
		if err != nil {
			ds.Logger.Debug("Failed to unmarshal JSON", "value", dsQuery.ModelJson)
			return nil, status.Errorf(codes.InvalidArgument, "failed to unmarshal request model: %v", err)
		}

		panelQuery := panelRequest.Query
		//queries = append(queries, query)

		metricQuery := &MetricQuery{
			Name: panelQuery.Name,
		}

		tags := map[string][]string{}
		for name, values := range panelQuery.Tags {
			if len(values) > 0 {
				tags[name] = values
			}
		}

		if len(tags) > 0 {
			metricQuery.Tags = tags
		}

		aggregators := make([]*Aggregator, 0)
		for _, aggregator := range panelQuery.Aggregators {
			var timeValue int
			var unit string

			for _, param := range aggregator.Parameters {
				if param.Name == "value" {
					timeValue, _ = strconv.Atoi(param.Value)
				} else if param.Name == "unit" {
					unit = param.Value
				}
			}

			//TODO support "align by" param
			aggregators = append(aggregators, &Aggregator{
				Name:           aggregator.Name,
				AlignSampling:  true,
				AlignStartTime: true,
				AlignEndTime:   false,
				Sampling: &Sampling{
					Value: timeValue,
					Unit:  unit,
				},
			})
		}

		if len(aggregators) > 0 {
			metricQuery.Aggregators = aggregators
		}

		groupby := panelQuery.GroupBy
		if groupby != nil {
			tagGroups := groupby.Tags
			if len(tagGroups) > 0 {
				metricQuery.GroupBy = []*Grouper{
					{
						Name: "tag",
						Tags: tagGroups,
					},
				}
			}
		}

		queries = append(queries, metricQuery)
	}

	return &Request{
		StartAbsolute: request.TimeRange.FromEpochMs,
		EndAbsolute:   request.TimeRange.ToEpochMs,
		Metrics:       queries,
	}, nil
}

//TODO support authentication
func (ds *Datasource) MakeHttpRequest(ctx context.Context, request *Request, url string) ([]byte, error) {
	rbody, err := json.Marshal(request)
	if err != nil {
		ds.Logger.Debug("Failed to marshal JSON", "value", request)
		return nil, status.Errorf(codes.Internal, "failed to marshal request body: %v", err)
	}

	url = url + "api/v1/datapoints/query"
	httpRequest, err := http.NewRequest(http.MethodPost, url, strings.NewReader(string(rbody)))
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to create HTTP request: %v", err)
	}

	httpRequest.Header.Add("Content-Type", "application/json")

	res, err := ctxhttp.Do(ctx, httpClient, httpRequest)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to complete HTTP request: %v", err)
	}
	defer res.Body.Close()

	//TODO handle http status codes
	//TODO log any error messages returned in body of request
	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid status code. status: %v", res.Status)
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to read response body: %v", err)
	}
	return body, nil
}

var httpClient = &http.Client{
	Transport: &http.Transport{
		TLSClientConfig: &tls.Config{
			Renegotiation: tls.RenegotiateFreelyAsClient,
		},
		Proxy: http.ProxyFromEnvironment,
		Dial: (&net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 30 * time.Second,
			DualStack: true,
		}).Dial,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
		MaxIdleConns:          100,
		IdleConnTimeout:       90 * time.Second,
	},
	Timeout: time.Duration(time.Second * 30),
}

func (ds *Datasource) ParseResponse(body []byte) (*datasource.DatasourceResponse, error) {
	responseBody := &Response{}
	err := json.Unmarshal(body, &responseBody)
	if err != nil {
		ds.Logger.Debug("Failed to unmarshal response body", "response", string(body))
		return nil, status.Errorf(codes.Internal, "failed to unmarshal response body: %v", err)
	}

	results := make([]*datasource.QueryResult, 0)
	for _, query := range responseBody.Queries {
		results = append(results, ds.ParseQueryResults(query.Results))
	}

	return &datasource.DatasourceResponse{
		Results: results,
	}, nil
}

func (ds *Datasource) ParseQueryResults(results []*QueryResult) *datasource.QueryResult {
	//refId := queries[0].(map[string]string)["refId"]
	//ds.logger.Info("RefID", refId)

	seriesSet := make([]*datasource.TimeSeries, 0)

	for _, result := range results {
		series := &datasource.TimeSeries{
			Name: result.Name,
		}

		if result.GroupInfo != nil {
			for _, groupInfo := range result.GroupInfo {
				if groupInfo.Name == "tag" {
					series.Tags = groupInfo.Group
				}
			}
		}

		for _, datapoint := range result.Values {
			timestamp := int64(datapoint[0])
			value := datapoint[1]
			series.Points = append(series.Points, &datasource.Point{
				Timestamp: timestamp,
				Value:     value,
			})
		}
		seriesSet = append(seriesSet, series)
	}

	//TODO add refID
	//TODO add any errors
	return &datasource.QueryResult{
		RefId:  "",
		Series: seriesSet,
	}
}
