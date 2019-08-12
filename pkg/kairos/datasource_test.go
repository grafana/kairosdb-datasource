package kairos_test

import (
	"bytes"
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/kairos"
	"github.com/zsabin/kairosdb-datasource/pkg/panel"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io/ioutil"
	"net/http"
	"testing"
)

func TestCreateQuery_MinimalQuery(t *testing.T) {
	ds := &kairos.Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
	}

	dsRequest := &datasource.DatasourceRequest{
		TimeRange: &datasource.TimeRange{
			FromEpochMs: 0,
			ToEpochMs:   100,
		},
		Queries: []*datasource.Query{
			{
				ModelJson: getModelJson(panelQuery),
			},
		},
	}

	expectedRequest := &kairos.Request{
		StartAbsolute: 0,
		EndAbsolute:   100,
		Metrics: []*kairos.MetricQuery{
			{
				Name: "MetricA",
			},
		},
	}

	request, err := ds.CreateQuery(dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequest, request)
}

func TestCreateQuery_WithTags(t *testing.T) {
	ds := &kairos.Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
		Tags: map[string][]string{
			"foo":  {"bar", "baz"},
			"foo1": {},
		},
	}

	dsRequest := &datasource.DatasourceRequest{
		TimeRange: &datasource.TimeRange{
			FromEpochMs: 0,
			ToEpochMs:   100,
		},
		Queries: []*datasource.Query{
			{
				ModelJson: getModelJson(panelQuery),
			},
		},
	}

	expectedRequest := &kairos.Request{
		StartAbsolute: 0,
		EndAbsolute:   100,
		Metrics: []*kairos.MetricQuery{
			{
				Name: "MetricA",
				Tags: map[string][]string{
					"foo": {"bar", "baz"},
				},
			},
		},
	}

	request, err := ds.CreateQuery(dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequest, request)
}

//TODO test multiple aggregators
func TestCreateQuery_WithAggregator(t *testing.T) {
	ds := &kairos.Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
		Aggregators: []*panel.Aggregator{
			{
				Name: "sum",
				Parameters: []*panel.AggregatorParameter{
					{
						Name:  "value",
						Value: "1",
					},
					{
						Name:  "unit",
						Value: "MINUTES",
					},
				},
			},
		},
	}

	dsRequest := &datasource.DatasourceRequest{
		TimeRange: &datasource.TimeRange{
			FromEpochMs: 0,
			ToEpochMs:   100,
		},
		Queries: []*datasource.Query{
			{
				ModelJson: getModelJson(panelQuery),
			},
		},
	}

	expectedRequest := &kairos.Request{
		StartAbsolute: 0,
		EndAbsolute:   100,
		Metrics: []*kairos.MetricQuery{
			{
				Name: "MetricA",
				Aggregators: []*kairos.Aggregator{
					{
						Name:           "sum",
						AlignSampling:  true,
						AlignStartTime: true,
						AlignEndTime:   false,
						Sampling: &kairos.Sampling{
							Value: 1,
							Unit:  "MINUTES",
						},
					},
				},
			},
		},
	}

	request, err := ds.CreateQuery(dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequest, request)
}

func TestCreateQuery_WithGroupBy(t *testing.T) {
	ds := &kairos.Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
		GroupBy: &panel.GroupBy{
			Tags: []string{"host", "pool"},
		},
	}

	dsRequest := &datasource.DatasourceRequest{
		TimeRange: &datasource.TimeRange{
			FromEpochMs: 0,
			ToEpochMs:   100,
		},
		Queries: []*datasource.Query{
			{
				ModelJson: getModelJson(panelQuery),
			},
		},
	}

	expectedRequest := &kairos.Request{
		StartAbsolute: 0,
		EndAbsolute:   100,
		Metrics: []*kairos.MetricQuery{
			{
				Name: "MetricA",
				GroupBy: []*kairos.Grouper{
					{
						Name: "tag",
						Tags: []string{"host", "pool"},
					},
				},
			},
		},
	}

	request, err := ds.CreateQuery(dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequest, request)
}

func getModelJson(query *panel.MetricQuery) string {
	req := panel.MetricRequest{
		RefID: "",
		Query: query,
	}
	rBytes, err := json.Marshal(req)
	if err != nil {
		panic("Failed to marshall metric request")
	}
	return string(rBytes)
}

func TestParseQueryResponse_SingleSeries(t *testing.T) {
	ds := &kairos.Datasource{}

	response := &kairos.Response{
		Queries: []*kairos.QueryResponse{
			{
				Results: []*kairos.QueryResult{
					{
						Name: "MetricA",
						Values: []*kairos.DataPoint{
							{
								1564682818000, 10.5,
							},
							{
								1564682819000, 8.2,
							},
						},
					},
				},
			},
		},
	}

	expectedResult := &datasource.DatasourceResponse{
		Results: []*datasource.QueryResult{
			{
				Series: []*datasource.TimeSeries{
					{
						Name: "MetricA",
						Points: []*datasource.Point{
							{
								Timestamp: 1564682818000,
								Value:     10.5,
							},
							{
								Timestamp: 1564682819000,
								Value:     8.2,
							},
						},
					},
				},
			},
		},
	}

	rBytes, _ := json.Marshal(response)
	result, err := ds.ParseQueryResponse(rBytes)

	assert.Nil(t, err)
	assert.Equal(t, expectedResult, result)
}

func TestParseQueryResponse_MultipleSeries(t *testing.T) {
	ds := &kairos.Datasource{}

	response := &kairos.Response{
		Queries: []*kairos.QueryResponse{
			{
				Results: []*kairos.QueryResult{
					{
						Name: "MetricA",
						GroupInfo: []*kairos.GroupInfo{
							{
								Name: "tag",
								Tags: []string{"host", "pool"},
								Group: map[string]string{
									"host":        "server1",
									"data_center": "dc1",
								},
							},
						},
						Values: []*kairos.DataPoint{
							{
								1564682818000, 10.5,
							},
						},
					},
					{
						Name: "MetricA",
						GroupInfo: []*kairos.GroupInfo{
							{
								Name: "tag",
								Tags: []string{"host", "pool"},
								Group: map[string]string{
									"host":        "server2",
									"data_center": "dc2",
								},
							},
						},
						Values: []*kairos.DataPoint{
							{
								1564682818000, 10.5,
							},
						},
					},
				},
			},
		},
	}

	expectedResult := &datasource.DatasourceResponse{
		Results: []*datasource.QueryResult{
			{
				Series: []*datasource.TimeSeries{
					{
						Name: "MetricA",
						Tags: map[string]string{
							"host":        "server1",
							"data_center": "dc1",
						},
						Points: []*datasource.Point{
							{
								Timestamp: 1564682818000,
								Value:     10.5,
							},
						},
					},
					{
						Name: "MetricA",
						Tags: map[string]string{
							"host":        "server2",
							"data_center": "dc2",
						},
						Points: []*datasource.Point{
							{
								Timestamp: 1564682818000,
								Value:     10.5,
							},
						},
					},
				},
			},
		},
	}

	rBytes, _ := json.Marshal(response)
	result, err := ds.ParseQueryResponse(rBytes)

	assert.Nil(t, err)
	assert.Equal(t, expectedResult, result)
}

func TestParseResponse_ErrorWithBody(t *testing.T) {
	ds := &kairos.Datasource{}

	rbody := &kairos.Response{
		Errors: []string{
			"error1",
			"error2",
		},
	}
	rBytes, _ := json.Marshal(rbody)

	response := &http.Response{
		StatusCode: http.StatusBadRequest,
		Status:     "400 - Bad Request",
		Body:       ioutil.NopCloser(bytes.NewReader(rBytes)),
	}

	result, err := ds.ParseResponse(response)

	assert.Nil(t, result)
	assert.Equal(t, status.Error(codes.Internal, "query request failed with status: 400 - Bad Request, errors: [error1, error2]"), err)
}

func TestParseResponse_ErrorWithNoBody(t *testing.T) {
	ds := &kairos.Datasource{}

	rbody := ""
	rBytes, _ := json.Marshal(rbody)

	response := &http.Response{
		StatusCode: http.StatusNotFound,
		Status:     "404 - Not Found",
		Body:       ioutil.NopCloser(bytes.NewReader(rBytes)),
	}

	result, err := ds.ParseResponse(response)

	assert.Nil(t, result)
	assert.Equal(t, status.Error(codes.Internal, "query request failed with status: 404 - Not Found, errors: []"), err)
}
