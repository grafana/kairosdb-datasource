package panel

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"testing"
)

func TestPanelMetricRequest(t *testing.T) {
	expected := &MetricRequest{
		RefID: "A",
		Query: &MetricQuery{
			Name: "abc.123",
			Aggregators: []*Aggregator{
				{
					Name: "sum",
					Parameters: []*AggregatorParameter{
						{
							Name:  "sampling",
							Text:  "align by",
							Type:  "alignment",
							Value: "NONE",
						},
						{
							Name:  "value",
							Text:  "every",
							Type:  "sampling",
							Value: "1",
						},
						{
							Name:  "unit",
							Text:  "unit",
							Type:  "sampling_unit",
							Value: "HOURS",
						},
					},
				},
			},
			Tags: map[string][]string{
				"datacenter": {},
				"host":       {"foo", "foo2"},
				"customer":   {"bar"},
			},
			GroupBy: &GroupBy{
				Tags: []string{
					"host",
					"datacenter",
				},
			},
		},
	}

	bytes, readError := ioutil.ReadFile("_testdata/ModelJson.json")
	if readError != nil {
		panic(readError)
	}

	actual := &MetricRequest{}
	parseError := json.Unmarshal(bytes, actual)

	assert.Nil(t, parseError, "Failed to unmarshal JSON: %v", parseError)
	assert.Equal(t, expected, actual)
}
