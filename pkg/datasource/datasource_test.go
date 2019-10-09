package datasource

import (
	"context"
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"testing"
)

type MockKairosDBClient struct {
	response []*remote.MetricQueryResults
}

func (m MockKairosDBClient) QueryMetrics(ctx context.Context, dsInfo *datasource.DatasourceInfo, request *remote.MetricQueryRequest) ([]*remote.MetricQueryResults, error) {
	return m.response, nil
}

type MockMetricQueryConverter struct {
	result *remote.MetricQuery
}

func (m MockMetricQueryConverter) Convert(query *MetricQuery) (*remote.MetricQuery, error) {
	return m.result, nil
}

type MockAggregatorConverter struct {
	result map[string]interface{}
}

func (m MockAggregatorConverter) Convert(query *Aggregator) (map[string]interface{}, error) {
	return m.result, nil
}

type MockGroupByConverter struct {
	result []*remote.Grouper
}

func (m MockGroupByConverter) Convert(groupBy *GroupBy) ([]*remote.Grouper, error) {
	return m.result, nil
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
	mockConverter := &MockMetricQueryConverter{}

	ds := &Datasource{
		KairosDBClient:       mockClient,
		MetricQueryConverter: mockConverter,
	}

	mockConverter.result = &remote.MetricQuery{}

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
				ModelJson: toModelJson(&MetricQuery{
					Name: "MetricA",
				}),
			},
			{
				RefId: "B",
				ModelJson: toModelJson(&MetricQuery{
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

func toModelJson(query *MetricQuery) string {
	req := MetricRequest{
		Query: query,
	}
	rBytes, err := json.Marshal(req)
	if err != nil {
		panic("Failed to marshall metric request")
	}
	return string(rBytes)
}
