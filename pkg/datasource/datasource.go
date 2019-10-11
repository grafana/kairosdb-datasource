package datasource

import (
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"github.com/pkg/errors"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type KairosDBDatasource struct {
	plugin.NetRPCUnsupportedPlugin
	kairosDBClient       remote.KairosDBClient
	metricQueryConverter MetricQueryConverter
	logger               hclog.Logger
}

func NewKairosDBDatasource(client remote.KairosDBClient, converter MetricQueryConverter, logger hclog.Logger) *KairosDBDatasource {
	return &KairosDBDatasource{
		kairosDBClient:       client,
		metricQueryConverter: converter,
		logger:               logger,
	}
}

func (ds *KairosDBDatasource) Query(ctx context.Context, dsRequest *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	refIds := make([]string, 0)
	var remoteQueries []*remote.MetricQuery

	for _, dsQuery := range dsRequest.Queries {
		refIds = append(refIds, dsQuery.RefId)
		remoteQuery, err := ds.createRemoteMetricQuery(dsQuery)
		if err != nil {
			return nil, status.Error(codes.InvalidArgument, err.Error())
		}
		remoteQueries = append(remoteQueries, remoteQuery)
	}

	remoteRequest := &remote.MetricQueryRequest{
		StartAbsolute: dsRequest.TimeRange.FromEpochMs,
		EndAbsolute:   dsRequest.TimeRange.ToEpochMs,
		Metrics:       remoteQueries,
	}

	results, err := ds.kairosDBClient.QueryMetrics(ctx, dsRequest.Datasource, remoteRequest)
	if err != nil {
		//TODO decorate error with proper gRPC status code
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

func (ds *KairosDBDatasource) createRemoteMetricQuery(dsQuery *datasource.Query) (*remote.MetricQuery, error) {
	metricRequest := &MetricRequest{}
	err := json.Unmarshal([]byte(dsQuery.ModelJson), metricRequest)
	if err != nil {
		ds.logger.Debug("Failed to unmarshal JSON", "value", dsQuery.ModelJson)
		return nil, errors.Wrap(err, "failed to unmarshal request model")
	}

	return ds.metricQueryConverter.Convert(metricRequest.Query)
}

func (ds *KairosDBDatasource) ParseQueryResult(results *remote.MetricQueryResults) *datasource.QueryResult {

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
