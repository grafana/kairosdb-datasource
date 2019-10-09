package datasource

import (
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Datasource struct {
	plugin.NetRPCUnsupportedPlugin
	KairosDBClient       remote.KairosDBClient
	MetricQueryConverter MetricQueryConverter
	Logger               hclog.Logger
}

func (ds *Datasource) Query(ctx context.Context, dsRequest *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	refIds := make([]string, 0)
	var remoteQueries []*remote.MetricQuery

	for _, dsQuery := range dsRequest.Queries {
		refIds = append(refIds, dsQuery.RefId)
		remoteQuery, err := ds.createRemoteMetricQuery(dsQuery)
		if err != nil {
			return nil, err
		}
		remoteQueries = append(remoteQueries, remoteQuery)
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

func (ds *Datasource) createRemoteMetricQuery(dsQuery *datasource.Query) (*remote.MetricQuery, error) {
	metricRequest := &MetricRequest{}
	err := json.Unmarshal([]byte(dsQuery.ModelJson), metricRequest)
	if err != nil {
		ds.Logger.Debug("Failed to unmarshal JSON", "value", dsQuery.ModelJson)
		return nil, status.Errorf(codes.InvalidArgument, "failed to unmarshal request model: %v", err)
	}

	return ds.MetricQueryConverter.Convert(metricRequest.Query)
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

type MetricQueryConverter interface {
	Convert(query *MetricQuery) (*remote.MetricQuery, error)
}

type MetricQueryConverterImpl struct {
	AggregatorConverter AggregatorConverter
}

func (c MetricQueryConverterImpl) Convert(query *MetricQuery) (*remote.MetricQuery, error) {
	remoteQuery := &remote.MetricQuery{
		Name: query.Name,
	}

	tags := map[string][]string{}
	for name, values := range query.Tags {
		if len(values) > 0 {
			tags[name] = values
		}
	}

	if len(tags) > 0 {
		remoteQuery.Tags = tags
	}

	var aggregators []map[string]interface{}
	for _, aggregator := range query.Aggregators {
		result, err := c.AggregatorConverter.Convert(aggregator)
		if err != nil {
			return nil, err
		}

		aggregators = append(aggregators, result)
	}

	if len(aggregators) > 0 {
		remoteQuery.Aggregators = aggregators
	}

	groupBy := query.GroupBy
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
