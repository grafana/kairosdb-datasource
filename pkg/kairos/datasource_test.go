package kairos

import (
	"context"
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/panel"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"testing"
)

type MockKairosDBClient struct {
	response []*remote.MetricQueryResults
}

func (m MockKairosDBClient) QueryMetrics(ctx context.Context, dsInfo *datasource.DatasourceInfo, request *remote.MetricQueryRequest) ([]*remote.MetricQueryResults, error) {
	return m.response, nil
}

func TestDatasource_CreateMetricQuery_MinimalQuery(t *testing.T) {
	ds := &Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
	}

	dsQuery := &datasource.Query{
		RefId:     "A",
		ModelJson: toModelJson(panelQuery),
	}

	expectedQuery := &remote.MetricQuery{
		Name: "MetricA",
	}

	actualQuery, err := ds.CreateMetricQuery(dsQuery)

	assert.Nil(t, err)
	assert.Equal(t, expectedQuery, actualQuery)
}

func TestDatasource_CreateMetricQuery_WithTags(t *testing.T) {
	ds := &Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
		Tags: map[string][]string{
			"foo":  {"bar", "baz"},
			"foo1": {},
		},
	}

	dsQuery := &datasource.Query{
		RefId:     "A",
		ModelJson: toModelJson(panelQuery),
	}

	expectedQuery := &remote.MetricQuery{
		Name: "MetricA",
		Tags: map[string][]string{
			"foo": {"bar", "baz"},
		},
	}

	actualQuery, err := ds.CreateMetricQuery(dsQuery)

	assert.Nil(t, err)
	assert.Equal(t, expectedQuery, actualQuery)
}

func TestDatasource_CreateMetricQuery_WithAggregators(t *testing.T) {
	ds := &Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
		Aggregators: []*panel.Aggregator{
			{
				Name: "sum",
				Parameters: []*panel.AggregatorParameter{
					{
						Name:  "value",
						Type:  "sampling",
						Value: "1m",
					},
					{
						Name:  "sampling",
						Type:  "alignment",
						Value: "NONE",
					},
				},
			},
			{
				Name: "percentile",
				Parameters: []*panel.AggregatorParameter{
					{
						Name:  "value",
						Type:  "sampling",
						Value: "1m",
					},
					{
						Name:  "sampling",
						Type:  "alignment",
						Value: "SAMPLING",
					},
					{
						Name:  "percentile",
						Type:  "any",
						Value: "0.95",
					},
				},
			},
			{
				Name: "scale",
				Parameters: []*panel.AggregatorParameter{
					{
						Name:  "factor",
						Type:  "any",
						Value: "2",
					},
				},
			},
		},
	}

	dsQuery := &datasource.Query{
		RefId:     "A",
		ModelJson: toModelJson(panelQuery),
	}

	expectedQuery := &remote.MetricQuery{
		Name: "MetricA",
		Aggregators: []map[string]interface{}{
			{
				"name":             "sum",
				"align_sampling":   false,
				"align_start_time": false,
				"align_end_time":   false,
				"sampling": &remote.Sampling{
					Value: 1,
					Unit:  "minutes",
				},
			},
			{
				"name":             "percentile",
				"align_sampling":   true,
				"align_start_time": false,
				"align_end_time":   false,
				"sampling": &remote.Sampling{
					Value: 1,
					Unit:  "minutes",
				},
				"percentile": 0.95,
			},
			{
				"name":   "scale",
				"factor": 2.0,
			},
		},
	}

	actualQuery, err := ds.CreateMetricQuery(dsQuery)

	assert.Nil(t, err)
	assert.Equal(t, expectedQuery, actualQuery)
}

func TestDatasource_CreateMetricQuery_WithGroupBy(t *testing.T) {
	ds := &Datasource{}

	panelQuery := &panel.MetricQuery{
		Name: "MetricA",
		GroupBy: &panel.GroupBy{
			Tags: []string{"host", "pool"},
		},
	}

	dsQuery := &datasource.Query{
		ModelJson: toModelJson(panelQuery),
	}

	expectedQuery := &remote.MetricQuery{
		Name: "MetricA",
		GroupBy: []*remote.Grouper{
			{
				Name: "tag",
				Tags: []string{"host", "pool"},
			},
		},
	}

	actualQuery, err := ds.CreateMetricQuery(dsQuery)

	assert.Nil(t, err)
	assert.Equal(t, expectedQuery, actualQuery)
}

func TestDatasource_ParseQueryResult_SingleSeries(t *testing.T) {
	ds := &Datasource{}

	kairosResults := &remote.MetricQueryResults{
		Results: []*remote.MetricQueryResult{
			{
				Name: "MetricA",
				Values: []*remote.DataPoint{
					{
						1564682818000, 10.5,
					},
					{
						1564682819000, 8.0,
					},
				},
			},
		},
	}

	expectedResults := &datasource.QueryResult{
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
	}

	actualResults := ds.ParseQueryResult(kairosResults)
	assert.Equal(t, expectedResults, actualResults)
}

func TestDatasource_ParseQueryResult_MultipleSeries(t *testing.T) {
	ds := &Datasource{}

	kairosResults := &remote.MetricQueryResults{
		Results: []*remote.MetricQueryResult{
			{
				Name: "MetricA",
				GroupInfo: []*remote.GroupInfo{
					{
						Name: "tag",
						Tags: []string{"host", "pool"},
						Group: map[string]string{
							"host":        "server1",
							"data_center": "dc1",
						},
					},
				},
				Values: []*remote.DataPoint{
					{
						1564682818000, 10.5,
					},
				},
			},
			{
				Name: "MetricA",
				GroupInfo: []*remote.GroupInfo{
					{
						Name: "tag",
						Tags: []string{"host", "pool"},
						Group: map[string]string{
							"host":        "server2",
							"data_center": "dc2",
						},
					},
				},
				Values: []*remote.DataPoint{
					{
						1564682818000, 10.5,
					},
				},
			},
		},
	}

	expectedResults := &datasource.QueryResult{
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
	}

	actualResults := ds.ParseQueryResult(kairosResults)
	assert.Equal(t, expectedResults, actualResults)
}

func TestDatasource_Query(t *testing.T) {
	mockClient := &MockKairosDBClient{}

	ds := &Datasource{
		KairosDBClient: mockClient,
	}

	mockClient.response = []*remote.MetricQueryResults{
		{
			Results: []*remote.MetricQueryResult{
				{
					Name: "MetricA",
					Values: []*remote.DataPoint{
						{
							1564682818000, 5,
						},
					},
				},
			},
		},
		{
			Results: []*remote.MetricQueryResult{
				{
					Name: "MetricB",
					Values: []*remote.DataPoint{
						{
							1564682818000, 10.5,
						},
					},
				},
			},
		},
	}

	dsRequest := &datasource.DatasourceRequest{
		TimeRange: &datasource.TimeRange{
			FromEpochMs: 1564682808000,
			ToEpochMs:   1564682828000,
		},
		Queries: []*datasource.Query{
			{
				RefId: "A",
				ModelJson: toModelJson(&panel.MetricQuery{
					Name: "MetricA",
				}),
			},
			{
				RefId: "B",
				ModelJson: toModelJson(&panel.MetricQuery{
					Name: "MetricB",
				}),
			},
		},
	}

	expectedResponse := &datasource.DatasourceResponse{
		Results: []*datasource.QueryResult{
			{
				RefId: "A",
				Series: []*datasource.TimeSeries{
					{
						Name: "MetricA",
						Tags: map[string]string{},
						Points: []*datasource.Point{
							{
								Timestamp: 1564682818000,
								Value:     5,
							},
						},
					},
				},
			},
			{
				RefId: "B",
				Series: []*datasource.TimeSeries{
					{
						Name: "MetricB",
						Tags: map[string]string{},
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

	actualResponse, err := ds.Query(context.TODO(), dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, expectedResponse, actualResponse)
}

func toModelJson(query *panel.MetricQuery) string {
	req := panel.MetricRequest{
		Query: query,
	}
	rBytes, err := json.Marshal(req)
	if err != nil {
		panic("Failed to marshall metric request")
	}
	return string(rBytes)
}
