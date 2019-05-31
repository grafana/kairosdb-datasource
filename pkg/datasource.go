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
	httpReq, err := ds.CreateQuery(request)
	if err != nil {
		return nil, err
	}
	bytes, err := ds.MakeHttpRequest(ctx, httpReq)

	ds.logger.Info("Response", "bytes", bytes, "error", err)

	response := &datasource.DatasourceResponse{}

	return response, nil
}

//func (ds *KairosDBDatasource) ParseQueryResponse(queries []*simplejson.Json, body []byte) (*datasource.DatasourceResponse, error) {
//	response := &datasource.DatasourceResponse{}
//	responseBody := []TargetResponseDTO{}
//	err := json.Unmarshal(body, &responseBody)
//	if err != nil {
//		return nil, err
//	}
//
//	for i, r := range responseBody {
//		refId := r.Target
//
//		qr := datasource.QueryResult{
//			RefId:  refId,
//			Series: make([]*datasource.TimeSeries, 0),
//			Tables: make([]*datasource.Table, 0),
//		}
//
//		serie := &datasource.TimeSeries{Name: r.Target}
//
//		for _, p := range r.DataPoints {
//			serie.Points = append(serie.Points, &datasource.Point{
//				Timestamp: int64(p[1]),
//				Value:     p[0],
//			})
//		}
//
//		qr.Series = append(qr.Series, serie)
//
//		response.Results = append(response.Results, &qr)
//	}
//
//	return response, nil
//}

func (ds *KairosDBDatasource) CreateQuery(request *datasource.DatasourceRequest) (*http.Request, error) {
	metrics := []interface{}{}
	for _, panelQuery := range request.Queries {
		var i interface{}
		err1 := json.Unmarshal([]byte(panelQuery.ModelJson), &i)
		modelJson := i.(map[string]interface{})

		ds.logger.Info("error1", err1)

		query := modelJson["query"].(map[string]interface{})

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

	rbody, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	url := request.Datasource.Url + "api/v1/datapoints/query"
	req, err := http.NewRequest(http.MethodPost, url, strings.NewReader(string(rbody)))
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")

	return req, nil
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
