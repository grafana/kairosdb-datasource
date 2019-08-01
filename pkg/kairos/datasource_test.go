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

	panelQuery := panel.MetricQuery{
		Name:        "MetricA",
		Aggregators: make([]panel.Aggregator, 0),
	}

	dsRequest := datasource.DatasourceRequest{
		TimeRange: &datasource.TimeRange{
			FromEpochMs: 0,
			ToEpochMs:   100,
		},
		Queries: []*datasource.Query{
			{
				ModelJson: getModelJson(&panelQuery),
			},
		},
	}

	expectedRequestBody := kairos.Request{
		StartAbsolute: "0",
		EndAbsolute:   "100",
		Metrics: []kairos.MetricQuery{
			{
				Name:        "MetricA",
				Aggregators: make([]kairos.Aggregator, 0),
			},
		},
	}

	request, err := ds.CreateQuery(&dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequestBody, *request)
}

//TODO test multiple aggregators
func TestCreateQuery_WithAggregator(t *testing.T) {
	ds := &kairos.Datasource{}

	panelQuery := panel.MetricQuery{
		Name: "MetricA",
		Aggregators: []panel.Aggregator{
			{
				Name: "sum",
				Parameters: []panel.AggregatorParameter{
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

	dsRequest := datasource.DatasourceRequest{
		TimeRange: &datasource.TimeRange{
			FromEpochMs: 0,
			ToEpochMs:   100,
		},
		Queries: []*datasource.Query{
			{
				ModelJson: getModelJson(&panelQuery),
			},
		},
	}

	expectedRequestBody := kairos.Request{
		StartAbsolute: "0",
		EndAbsolute:   "100",
		Metrics: []kairos.MetricQuery{
			{
				Name: "MetricA",
				Aggregators: []kairos.Aggregator{
					{
						Name:           "sum",
						AlignSampling:  true,
						AlignStartTime: true,
						AlignEndTime:   false,
						Sampling: kairos.Sampling{
							Value: 1,
							Unit:  "MINUTES",
						},
					},
				},
			},
		},
	}

	request, err := ds.CreateQuery(&dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedRequestBody, *request)
}

func getModelJson(query *panel.MetricQuery) string {
	req := panel.MetricRequest{
		RefID: "",
		Query: *query,
	}
	bytes, err := json.Marshal(req)
	if err != nil {
		panic("Failed to marshall metric request")
	}
	return string(bytes)
}
