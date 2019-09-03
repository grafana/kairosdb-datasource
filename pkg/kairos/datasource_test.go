package kairos_test

import (
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/kairos"
	"github.com/zsabin/kairosdb-datasource/pkg/panel"
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

	expectedRequest := &kairos.MetricQueryRequest{
		StartAbsolute: 0,
		EndAbsolute:   100,
		Metrics: []*kairos.MetricQuery{
			{
				Name: "MetricA",
			},
		},
	}

	request, err := ds.CreateMetricQueryRequest(dsRequest)

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

	expectedRequest := &kairos.MetricQueryRequest{
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

	request, err := ds.CreateMetricQueryRequest(dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequest, request)
}

func TestCreateQuery_WithAggregators(t *testing.T) {
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
					{
						Name:  "sampling",
						Value: "NONE",
					},
				},
			},
			{
				Name: "avg",
				Parameters: []*panel.AggregatorParameter{
					{
						Name:  "value",
						Value: "1",
					},
					{
						Name:  "unit",
						Value: "MINUTES",
					},
					{
						Name:  "sampling",
						Value: "SAMPLING",
					},
				},
			},
			{
				Name: "max",
				Parameters: []*panel.AggregatorParameter{
					{
						Name:  "value",
						Value: "1",
					},
					{
						Name:  "unit",
						Value: "MINUTES",
					},
					{
						Name:  "sampling",
						Value: "START_TIME",
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

	expectedRequest := &kairos.MetricQueryRequest{
		StartAbsolute: 0,
		EndAbsolute:   100,
		Metrics: []*kairos.MetricQuery{
			{
				Name: "MetricA",
				Aggregators: []*kairos.Aggregator{
					{
						Name:           "sum",
						AlignSampling:  false,
						AlignStartTime: false,
						AlignEndTime:   false,
						Sampling: &kairos.Sampling{
							Value: 1,
							Unit:  "MINUTES",
						},
					},
					{
						Name:           "avg",
						AlignSampling:  true,
						AlignStartTime: false,
						AlignEndTime:   false,
						Sampling: &kairos.Sampling{
							Value: 1,
							Unit:  "MINUTES",
						},
					},
					{
						Name:           "max",
						AlignSampling:  false,
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

	request, err := ds.CreateMetricQueryRequest(dsRequest)

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

	expectedRequest := &kairos.MetricQueryRequest{
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

	request, err := ds.CreateMetricQueryRequest(dsRequest)

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

	results := []*kairos.MetricQueryResults{
		{
			Results: []*kairos.MetricQueryResult{
				{
					Name: "MetricA",
					Values: []*kairos.DataPoint{
						{
							1564682818000, 10.5,
						},
						{
							1564682819000, 8.0,
						},
					},
				},
			},
		},
	}

	expectedResponse := &datasource.DatasourceResponse{
		Results: []*datasource.QueryResult{
			{
				Series: []*datasource.TimeSeries{
					{
						Name: "MetricA",
						Tags: map[string]string{},
						Points: []*datasource.Point{
							{
								Timestamp: 1564682818000,
								Value:     10.5,
							},
							{
								Timestamp: 1564682819000,
								Value:     8.0,
							},
						},
					},
				},
			},
		},
	}

	actualResponse := ds.ParseQueryResults(results)
	assert.Equal(t, expectedResponse, actualResponse)
}

func TestParseQueryResponse_MultipleSeries(t *testing.T) {
	ds := &kairos.Datasource{}

	results := []*kairos.MetricQueryResults{
		{
			Results: []*kairos.MetricQueryResult{
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
	}

	expectedResponse := &datasource.DatasourceResponse{
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

	actualResponse := ds.ParseQueryResults(results)
	assert.Equal(t, expectedResponse, actualResponse)
}
