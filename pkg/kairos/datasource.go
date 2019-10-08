package kairos

import (
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"github.com/zsabin/kairosdb-datasource/pkg/panel"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Datasource struct {
	plugin.NetRPCUnsupportedPlugin
	KairosDBClient remote.KairosDBClient
	Logger         hclog.Logger
}

func (ds *Datasource) Query(ctx context.Context, dsRequest *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	refIds := make([]string, 0)
	var remoteQueries []*remote.MetricQuery

	for _, dsQuery := range dsRequest.Queries {
		refIds = append(refIds, dsQuery.RefId)
		query, err := ds.CreateMetricQuery(dsQuery)
		if err != nil {
			return nil, err
		}
		remoteQueries = append(remoteQueries, query)
	}

	remoteRequest := &remote.MetricQueryRequest{
		StartAbsolute: dsRequest.TimeRange.FromEpochMs,
		EndAbsolute:   dsRequest.TimeRange.ToEpochMs,
		Metrics:       remoteQueries,
	}

	results, err := ds.KairosDBClient.QueryMetrics(ctx, dsRequest.Datasource, remoteRequest)
	if err != nil {
		return nil, err
	}

	dsResults := make([]*datasource.QueryResult, 0)

	for i, result := range results {
		qr := ds.ParseQueryResult(result)
		qr.RefId = refIds[i]
		dsResults = append(dsResults, qr)
	}

	return &datasource.DatasourceResponse{
		Results: dsResults,
	}, nil
}

func (ds *Datasource) CreateMetricQuery(dsQuery *datasource.Query) (*remote.MetricQuery, error) {
	metricRequest := &panel.MetricRequest{}
	err := json.Unmarshal([]byte(dsQuery.ModelJson), metricRequest)
	if err != nil {
		ds.Logger.Debug("Failed to unmarshal JSON", "value", dsQuery.ModelJson)
		return nil, status.Errorf(codes.InvalidArgument, "failed to unmarshal request model: %v", err)
	}

	metricQuery := metricRequest.Query

	remoteQuery := &remote.MetricQuery{
		Name: metricQuery.Name,
	}

	tags := map[string][]string{}
	for name, values := range metricQuery.Tags {
		if len(values) > 0 {
			tags[name] = values
		}
	}

	if len(tags) > 0 {
		remoteQuery.Tags = tags
	}

	var aggregators []map[string]interface{}
	for _, aggregator := range metricQuery.Aggregators {
		result, err := ParseAggregator(aggregator)
		if err != nil {
			return nil, err
		}

		aggregators = append(aggregators, result)
	}

	if len(aggregators) > 0 {
		remoteQuery.Aggregators = aggregators
	}

	groupBy := metricQuery.GroupBy
	if groupBy != nil {
		tagGroups := groupBy.Tags
		if len(tagGroups) > 0 {
			remoteQuery.GroupBy = []*remote.Grouper{
				{
					Name: "tag",
					Tags: tagGroups,
				},
			}
		}
	}
	return remoteQuery, nil
}

func (ds *Datasource) ParseQueryResult(results *remote.MetricQueryResults) *datasource.QueryResult {

	seriesSet := make([]*datasource.TimeSeries, 0)

	for _, result := range results.Results {
		series := &datasource.TimeSeries{
			Name: result.Name,
			Tags: result.GetTaggedGroup(),
		}

		for _, dataPoint := range result.Values {
			value := dataPoint[1]

			series.Points = append(series.Points, &datasource.Point{
				Timestamp: int64(dataPoint[0]),
				Value:     value,
			})
		}
		seriesSet = append(seriesSet, series)
	}

	return &datasource.QueryResult{
		Series: seriesSet,
	}
}
