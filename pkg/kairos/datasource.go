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
		ds.Logger.Error("Failed to create query", "error", err)
		return nil, err
	}

	bytes, err := ds.MakeHttpRequest(ctx, req, request.Datasource.Url)
	if err != nil {
		ds.Logger.Error("Failed to make HTTP request", "error", err)
		return nil, err
	}

	datasourceResponse, err := ds.ParseResponse(bytes)
	if err != nil {
		ds.Logger.Error("Failed to parse datasource response", "error", err)
		return nil, err
	}

	return datasourceResponse, nil
}

func (ds *Datasource) CreateQuery(request *datasource.DatasourceRequest) (*Request, error) {
	var queries []*MetricQuery
	//var queries []panel.MetricQuery

	for _, dsQuery := range request.Queries {
		rawRequest := &panel.MetricRequest{}
		err := json.Unmarshal([]byte(dsQuery.ModelJson), rawRequest)
		if err != nil {
			ds.Logger.Debug("Failed to unmarshal JSON", "value", dsQuery.ModelJson)
			return nil, fmt.Errorf("failed to unmarshal query JSON: %v", err)
		}

		rawQuery := rawRequest.Query
		//queries = append(queries, query)

		metricQuery := &MetricQuery{
			Name: rawQuery.Name,
		}

		aggregators := make([]*Aggregator, 0)
		for _, aggregator := range rawQuery.Aggregators {
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

		groupby := rawQuery.GroupBy
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
		StartAbsolute: strconv.FormatInt(request.TimeRange.FromEpochMs, 10),
		EndAbsolute:   strconv.FormatInt(request.TimeRange.ToEpochMs, 10),
		Metrics:       queries,
	}, nil
}

func (ds *Datasource) MakeHttpRequest(ctx context.Context, request *Request, url string) ([]byte, error) {
	rbody, err := json.Marshal(request)
	if err != nil {
		ds.Logger.Debug("Failed to marshal JSON", "value", request)
		return nil, err
	}

	url = url + "api/v1/datapoints/query"
	httpRequest, err := http.NewRequest(http.MethodPost, url, strings.NewReader(string(rbody)))
	if err != nil {
		return nil, err
	}

	httpRequest.Header.Add("Content-Type", "application/json")

	res, err := ctxhttp.Do(ctx, httpClient, httpRequest)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid status code. status: %v", res.Status)
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
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
		ds.Logger.Debug("Failed to unmarshall response", "response", string(body))
		return nil, err
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
