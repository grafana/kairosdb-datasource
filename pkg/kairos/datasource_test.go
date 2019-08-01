package kairos_test

import (
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/kairos"
	"github.com/zsabin/kairosdb-datasource/pkg/panel"
	"testing"
)

func TestCreateQuery_NoAggregators(t *testing.T) {
	ds := &kairos.Datasource{}

	panelQuery := &panel.MetricQuery{
		Name:        "MetricA",
		Aggregators: make([]*panel.Aggregator, 0),
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

	expectedRequestBody := &kairos.Request{
		StartAbsolute: "0",
		EndAbsolute:   "100",
		Metrics: []*kairos.MetricQuery{
			{
				Name:        "MetricA",
				Aggregators: make([]*kairos.Aggregator, 0),
			},
		},
	}

	request, err := ds.CreateQuery(dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequestBody, request)
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

	expectedRequestBody := &kairos.Request{
		StartAbsolute: "0",
		EndAbsolute:   "100",
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
	assert.Equal(t, expectedRequestBody, request)
}

func getModelJson(query *panel.MetricQuery) string {
	req := panel.MetricRequest{
		RefID: "",
		Query: query,
	}
	bytes, err := json.Marshal(req)
	if err != nil {
		panic("Failed to marshall metric request")
	}
	return string(bytes)
}

func TestParseQuery_SingleQuery(t *testing.T) {
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

	bytes, _ := json.Marshal(response)
	result, err := ds.ParseResponse(bytes)

	assert.Nil(t, err)
	assert.Equal(t, expectedResult, result)
}
