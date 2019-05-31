package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"golang.org/x/net/context"
	"golang.org/x/net/context/ctxhttp"
	"io/ioutil"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type KairosDBDatasource struct {
	plugin.NetRPCUnsupportedPlugin
	logger hclog.Logger
}

func (ds *KairosDBDatasource) Query(ctx context.Context, request *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	remoteRequest, err := ds.CreateQuery(request)
	if err != nil {
		ds.logger.Error("Error", err)
		return nil, err
	}
	ds.logger.Info("Remote Request", remoteRequest.req)

	bytes, err := ds.MakeHttpRequest(ctx, remoteRequest.req)
	if err != nil {
		ds.logger.Error("Error", err)
		return nil, err
	}

	datsourceResponse, err := ds.ParseQueryResponse(remoteRequest.queries, bytes)
	if err != nil {
		ds.logger.Error("Error", err)
		return nil, err
	}

	return datsourceResponse, nil
}

func (ds *KairosDBDatasource) ParseQueryResponse(queries []interface{}, body []byte) (*datasource.DatasourceResponse, error) {
	response := &datasource.DatasourceResponse{}
	responseBody := &KairosResponse{}

	err := json.Unmarshal(body, &responseBody)
	if err != nil {
		return nil, err
	}

	for _, result := range responseBody.Queries[0].Results {
		//refId := queries[0].(map[string]string)["refId"]
		//ds.logger.Info("RefID", refId)
		qr := datasource.QueryResult{
			RefId:  "",
			Series: make([]*datasource.TimeSeries, 0),
		}
		serie := &datasource.TimeSeries{Name: result.Name}

		for _, datapoint := range result.Values {
			timestamp := int64(datapoint[0])
			value := datapoint[1]
			serie.Points = append(serie.Points, &datasource.Point{
				Timestamp: timestamp,
				Value:     value,
			})
		}

		qr.Series = append(qr.Series, serie)
		response.Results = append(response.Results, &qr)
	}

	return response, nil
}

func (ds *KairosDBDatasource) CreateQuery(request *datasource.DatasourceRequest) (*RemoteDatasourceRequest, error) {
	metrics := []interface{}{}
	queries := []interface{}{}
	for _, panelQuery := range request.Queries {
		var i interface{}
		err1 := json.Unmarshal([]byte(panelQuery.ModelJson), &i)
		modelJson := i.(map[string]interface{})

		ds.logger.Info("error1", err1)

		query := modelJson["query"].(map[string]interface{})
		queries = append(queries, query)

		metricQuery := map[string]interface{}{
			"name": query["metricName"],
		}
		metrics = append(metrics, metricQuery)
	}

	ds.logger.Info("Metrics", "length", len(metrics))
	payload := map[string]interface{}{
		"start_absolute": strconv.FormatInt(request.TimeRange.FromEpochMs, 10),
		"end_absolute":   strconv.FormatInt(request.TimeRange.ToEpochMs, 10),
		"metrics":        metrics,
	}

	ds.logger.Info("Query", "metric name", metrics[0].(map[string]interface{})["name"])

	rbody, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	ds.logger.Info("RBody", rbody)

	url := request.Datasource.Url + "api/v1/datapoints/query"
	req, err := http.NewRequest(http.MethodPost, url, strings.NewReader(string(rbody)))
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")

	return &RemoteDatasourceRequest{
		req:     req,
		queries: queries,
	}, nil
}

func (ds *KairosDBDatasource) MakeHttpRequest(ctx context.Context, httpRequest *http.Request) ([]byte, error) {
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
