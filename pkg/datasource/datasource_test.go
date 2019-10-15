package datasource_test

import (
	"context"
	"encoding/json"
	"github.com/golang/mock/gomock"
	grafana "github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/datasource"
	"github.com/zsabin/kairosdb-datasource/pkg/datasource/internal/mock_datasource"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"testing"
)

func TestDatasource_ParseQueryResult_SingleSeries(t *testing.T) {
	ds := &datasource.KairosDBDatasource{}

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

	expectedResults := &grafana.QueryResult{
		Series: []*grafana.TimeSeries{
			{
				Name: "MetricA",
				Tags: map[string]string{},
				Points: []*grafana.Point{
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
	ds := &datasource.KairosDBDatasource{}

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

	expectedResults := &grafana.QueryResult{
		Series: []*grafana.TimeSeries{
			{
				Name: "MetricA",
				Tags: map[string]string{
					"host":        "server1",
					"data_center": "dc1",
				},
				Points: []*grafana.Point{
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
				Points: []*grafana.Point{
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
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockConverter := mock_datasource.NewMockMetricQueryConverter(ctrl)
	mockClient := mock_datasource.NewMockKairosDBClient(ctrl)

	ds := datasource.NewKairosDBDatasource(mockClient, mockConverter)

	dsRequest := &grafana.DatasourceRequest{
		Datasource: &grafana.DatasourceInfo{},
		TimeRange: &grafana.TimeRange{
			FromEpochMs: 1564682808000,
			ToEpochMs:   1564682828000,
		},
		Queries: []*grafana.Query{
			{
				RefId: "A",
				ModelJson: toModelJson(&datasource.MetricQuery{
					Name: "MetricA",
				}),
			},
			{
				RefId: "B",
				ModelJson: toModelJson(&datasource.MetricQuery{
					Name: "MetricB",
				}),
			},
		},
	}

	mockConverter.EXPECT().
		Convert(gomock.Any()).
		Return(&remote.MetricQuery{}, nil).
		AnyTimes()

	expectedMetricRequest := &remote.MetricQueryRequest{
		StartAbsolute: 1564682808000,
		EndAbsolute:   1564682828000,
		Metrics: []*remote.MetricQuery{
			{}, {},
		},
	}

	mockClient.EXPECT().
		QueryMetrics(context.TODO(), dsRequest.Datasource, expectedMetricRequest).
		Return([]*remote.MetricQueryResults{
			{
				Results: []*remote.MetricQueryResult{
					{
						Name: "MetricA",
						Values: []*remote.DataPoint{
							{
								1564682814000, 5,
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
		}, nil).
		Times(1)

	response, err := ds.Query(context.TODO(), dsRequest)

	assert.Nil(t, err)
	assert.Equal(t, &grafana.DatasourceResponse{
		Results: []*grafana.QueryResult{
			{
				RefId: "A",
				Series: []*grafana.TimeSeries{
					{
						Name: "MetricA",
						Tags: map[string]string{},
						Points: []*grafana.Point{
							{
								Timestamp: 1564682814000,
								Value:     5,
							},
						},
					},
				},
			},
			{
				RefId: "B",
				Series: []*grafana.TimeSeries{
					{
						Name: "MetricB",
						Tags: map[string]string{},
						Points: []*grafana.Point{
							{
								Timestamp: 1564682818000,
								Value:     10.5,
							},
						},
					},
				},
			},
		},
	}, response)
}

func toModelJson(query *datasource.MetricQuery) string {
	req := datasource.MetricRequest{
		Query: query,
	}
	rBytes, err := json.Marshal(req)
	if err != nil {
		panic("Failed to marshall metric request")
	}
	return string(rBytes)
}
