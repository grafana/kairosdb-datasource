package remote

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/pkg/errors"
	"golang.org/x/net/context/ctxhttp"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"
	"strings"
)

type ResponseError struct {
	Messages []string
	Status   int
}

func (e *ResponseError) Error() string {
	return fmt.Sprintf("KairosDB response error: status=%d, messages=[%v]", e.Status, strings.Join(e.Messages, ", "))
}

type KairosDBClient interface {
	QueryMetrics(ctx context.Context, dsInfo *datasource.DatasourceInfo, request *MetricQueryRequest) ([]*MetricQueryResults, error)
}

type KairosDBClientImpl struct {
	httpClient *http.Client
	logger     hclog.Logger
}

func NewKairosDBClientImpl(httpClient *http.Client, logger hclog.Logger) *KairosDBClientImpl {
	return &KairosDBClientImpl{
		httpClient: httpClient,
		logger:     logger,
	}
}

//TODO support authentication
func (client *KairosDBClientImpl) QueryMetrics(ctx context.Context, dsInfo *datasource.DatasourceInfo, request *MetricQueryRequest) ([]*MetricQueryResults, error) {
	httpRequest, err := client.buildHTTPRequest(dsInfo, request)
	if err != nil {
		return nil, err
	}

	res, err := ctxhttp.Do(ctx, client.httpClient, httpRequest)
	if err != nil {
		return nil, errors.Wrap(err, "failed to execute HTTP request")
	}

	defer res.Body.Close()

	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, errors.Wrap(err, "failed to read metric query response body")
	}

	metricResponse := &MetricQueryResponse{}
	err = json.Unmarshal(resBody, &metricResponse)

	if res.StatusCode >= 200 && res.StatusCode < 300 {
		return metricResponse.Queries, errors.Wrap(err, "failed to unmarshal metric query response")
	}

	return nil, &ResponseError{
		Status:   res.StatusCode,
		Messages: metricResponse.Errors,
	}
}

func (client *KairosDBClientImpl) buildHTTPRequest(dsInfo *datasource.DatasourceInfo, request *MetricQueryRequest) (*http.Request, error) {
	reqBody, err := json.Marshal(request)
	if err != nil {
		return nil, errors.Wrap(err, "failed to marshal metric query request body")
	}

	kairosURL, _ := url.Parse(dsInfo.Url)
	kairosURL.Path = path.Join(kairosURL.Path, "api/v1/datapoints/query")

	httpRequest, err := http.NewRequest(http.MethodPost, kairosURL.String(), strings.NewReader(string(reqBody)))
	if err != nil {
		return nil, errors.Wrap(err, "failed to create HTTP request")
	}

	httpRequest.Header.Add("Content-Type", "application/json")

	return httpRequest, nil
}
