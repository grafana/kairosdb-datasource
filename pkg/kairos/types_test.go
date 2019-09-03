package kairos_test

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/kairos"
	"io/ioutil"
	"testing"
)

func TestKairosDBRequest(t *testing.T) {
	expected := &kairos.MetricQueryRequest{
		StartAbsolute: 1357023600000,
		EndAbsolute:   1357024600000,
		Metrics: []*kairos.MetricQuery{
			{
				Name: "abc.123",
				Aggregators: []*kairos.Aggregator{
					{
						Name: "sum",
						Sampling: &kairos.Sampling{
							Value: 10,
							Unit:  "minutes",
						},
					},
				},
				Tags: map[string][]string{
					"host":     {"foo", "foo2"},
					"customer": {"bar"},
				},
				GroupBy: []*kairos.Grouper{
					{
						Name: "tag",
						Tags: []string{
							"data_center",
							"host",
						},
					},
				},
			},
		},
	}

	bytes, readError := ioutil.ReadFile("_testdata/KairosDBRequest.json")
	if readError != nil {
		panic(readError)
	}

	actual := &kairos.MetricQueryRequest{}
	parseError := json.Unmarshal(bytes, actual)

	assert.Nil(t, parseError, "Failed to unmarshal JSON: %v", parseError)
	assert.Equal(t, expected, actual)
}

func TestKairosDBResponse(t *testing.T) {
	expected := &kairos.MetricQueryResponse{
		Queries: []*kairos.MetricQueryResults{
			{
				Results: []*kairos.MetricQueryResult{
					{
						Name: "abc.123",
						GroupInfo: []*kairos.GroupInfo{
							{
								Name: "type",
							},
							{
								Name: "tag",
								Tags: []string{"host"},
								Group: map[string]string{
									"host": "server1",
								},
							},
						},
						Tags: map[string][]string{
							"host":     {"server1"},
							"customer": {"bar"},
						},
						Values: []*kairos.DataPoint{
							{
								1364968800000,
								11019,
							},
							{
								1366351200000,
								2843,
							},
						},
					},
				},
			},
		},
	}

	bytes, readError := ioutil.ReadFile("_testdata/KairosDBResponse.json")
	if readError != nil {
		panic(readError)
	}

	actual := &kairos.MetricQueryResponse{}
	parseError := json.Unmarshal(bytes, actual)

	assert.Nil(t, parseError, "Failed to unmarshal JSON: %v", parseError)
	assert.Equal(t, expected, actual)
}

func TestKairosDBErrorResponse(t *testing.T) {
	expected := &kairos.MetricQueryResponse{
		Errors: []string{
			"metrics[0].aggregate must be one of MIN,SUM,MAX,AVG,DEV",
			"metrics[0].sampling.unit must be one of  SECONDS,MINUTES,HOURS,DAYS,WEEKS,YEARS",
		},
	}

	bytes, readError := ioutil.ReadFile("_testdata/KairosDBErrorResponse.json")
	if readError != nil {
		panic(readError)
	}

	actual := &kairos.MetricQueryResponse{}
	parseError := json.Unmarshal(bytes, actual)

	assert.Nil(t, parseError, "Failed to unmarshal JSON: %v", parseError)
	assert.Equal(t, expected, actual)
}

func TestMetricQueryResult_GetTaggedGroup_nilGroupInfo(t *testing.T) {
	result := kairos.MetricQueryResult{
		Name: "Foo",
		Values: []*kairos.DataPoint{
			{0, 0},
		},
	}

	assert.Equal(t, map[string]string{}, result.GetTaggedGroup())
}

func TestMetricQueryResult_GetTaggedGroup_withTagGroup(t *testing.T) {
	expectedGroup := map[string]string{
		"host":     "server1",
		"customer": "foo",
	}

	result := kairos.MetricQueryResult{
		Name: "Foo",
		Values: []*kairos.DataPoint{
			{0, 0},
		},
		GroupInfo: []*kairos.GroupInfo{
			{
				Name:  "tag",
				Tags:  []string{"host", "customer"},
				Group: expectedGroup,
			},
		},
	}

	assert.Equal(t, expectedGroup, result.GetTaggedGroup())
}
