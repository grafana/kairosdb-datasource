package remote

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"net/http"
	"os"
	"testing"
)

type MockTransport struct {
	response *http.Response
	request  *http.Request
}

func (m *MockTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	m.request = req
	return m.response, nil
}

func TestMain(m *testing.M) {
	setup()
	code := m.Run()
	os.Exit(code)
}

var kairosClient KairosDBClient
var mockTransport *MockTransport
var dsInfo *datasource.DatasourceInfo

var okResponsePayload []byte
var errorResponsePayload []byte

func init() {

	var err error
	okResponsePayload, err = ioutil.ReadFile("_testdata/KairosDBResponse.json")
	if err != nil {
		panic(err)
	}

	errorResponsePayload, err = ioutil.ReadFile("_testdata/KairosDBErrorResponse.json")
	if err != nil {
		panic(err)
	}
}

func setup() {

	mockTransport = new(MockTransport)
	mockTransport.response = &http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBuffer(okResponsePayload)),
	}

	httpClient := &http.Client{
		Transport: mockTransport,
	}

	kairosClient = &KairosDBClientImpl{
		httpClient: httpClient,
	}

	dsInfo = &datasource.DatasourceInfo{
		Url: "http://localhost/",
	}
}

func TestQueryMetrics_urlWithTrailingSlash(t *testing.T) {

	dsInfo.Url = "http://localhost/"

	_, _ = kairosClient.QueryMetrics(context.TODO(), dsInfo, &MetricQueryRequest{})

	request := mockTransport.request
	assert.Equal(t, http.MethodPost, request.Method)
	assert.Equal(t, "http://localhost/api/v1/datapoints/query", request.URL.String())
}

func TestQueryMetrics_urlWithNoTrailingSlash(t *testing.T) {

	dsInfo.Url = "http://localhost"

	_, _ = kairosClient.QueryMetrics(context.TODO(), dsInfo, &MetricQueryRequest{})

	request := mockTransport.request
	assert.Equal(t, http.MethodPost, request.Method)
	assert.Equal(t, "http://localhost/api/v1/datapoints/query", request.URL.String())
}

func TestQueryMetrics_okResponse(t *testing.T) {

	mockTransport.response = &http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBuffer(okResponsePayload)),
	}

	expectedResponse := &MetricQueryResponse{}
	err := json.Unmarshal(okResponsePayload, &expectedResponse)

	results, err := kairosClient.QueryMetrics(context.TODO(), dsInfo, &MetricQueryRequest{})

	assert.Nil(t, err)
	assert.Equal(t, expectedResponse.Queries, results)
}

func TestQueryMetrics_errorResponse(t *testing.T) {

	mockTransport.response = &http.Response{
		StatusCode: 400,
		Body:       ioutil.NopCloser(bytes.NewBuffer(errorResponsePayload)),
	}

	expectedError := &ResponseError{
		Status: 400,
		Messages: []string{
			"metrics[0].aggregate must be one of MIN,SUM,MAX,AVG,DEV",
			"metrics[0].sampling.unit must be one of  SECONDS,MINUTES,HOURS,DAYS,WEEKS,YEARS",
		},
	}
	results, err := kairosClient.QueryMetrics(context.TODO(), dsInfo, &MetricQueryRequest{})

	assert.Nil(t, results)
	assert.Equal(t, expectedError, err)
}

func TestResponseError_Error(t *testing.T) {
	err := &ResponseError{
		Status: 400,
		Messages: []string{
			"error1",
			"error2",
		},
	}

	expectedMsg := "KairosDB response error: status=400, messages=[error1, error2]"

	assert.Equal(t, expectedMsg, err.Error())
}

func TestResponseError_Error_WithNoMessages(t *testing.T) {
	err := &ResponseError{
		Status: 400,
	}

	expectedMsg := "KairosDB response error: status=400, messages=[]"

	assert.Equal(t, expectedMsg, err.Error())
}
