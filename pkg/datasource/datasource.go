package datasource

import (
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-plugin"
	"github.com/pkg/errors"
	"github.com/zsabin/kairosdb-datasource/pkg/logging"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var logger = logging.Get("datasource").Named("KairosDBDatasource")

type KairosDBClient interface {
	QueryMetrics(ctx context.Context, dsInfo *datasource.DatasourceInfo, request *remote.MetricQueryRequest) ([]*remote.MetricQueryResults, error)
}

type KairosDBDatasource struct {
	plugin.NetRPCUnsupportedPlugin
	kairosDBClient       KairosDBClient
	metricQueryConverter MetricQueryConverter
}

func NewKairosDBDatasource(client KairosDBClient, converter MetricQueryConverter) *KairosDBDatasource {
	return &KairosDBDatasource{
		kairosDBClient:       client,
		metricQueryConverter: converter,
	}
}

func (ds *KairosDBDatasource) Query(ctx context.Context, dsRequest *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	refIds := make([]string, 0)
	var remoteQueries []*remote.MetricQuery

	for _, dsQuery := range dsRequest.Queries {
		refIds = append(refIds, dsQuery.RefId)
		remoteQuery, err := ds.createRemoteMetricQuery(dsQuery)
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "failed to parse metric query: %s", err)
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
		return nil, status.Errorf(codes.Internal, "remote metric query failed: %s", err)
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
		logger.Debug("Failed to unmarshal JSON", "value", dsQuery.ModelJson)
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
