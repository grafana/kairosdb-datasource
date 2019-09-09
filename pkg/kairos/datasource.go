package kairos

import (
	"encoding/json"
	"github.com/grafana/grafana_plugin_model/go/datasource"
	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"
	"github.com/zsabin/kairosdb-datasource/pkg/panel"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"strconv"
)

type Datasource struct {
	plugin.NetRPCUnsupportedPlugin
	KairosDBClient Client
	Logger         hclog.Logger
}

func (ds *Datasource) Query(ctx context.Context, dsRequest *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	var refIds []string
	for _, query := range dsRequest.Queries {
		refIds = append(refIds, query.RefId)
	}

	var kairosQueries []*MetricQuery
	for _, dsQuery := range dsRequest.Queries {
		query, err := ds.CreateMetricQuery(dsQuery)
		if err != nil {
			return nil, err
		}
		kairosQueries = append(kairosQueries, query)
	}

	kairosRequest := &MetricQueryRequest{
		StartAbsolute: dsRequest.TimeRange.FromEpochMs,
		EndAbsolute:   dsRequest.TimeRange.ToEpochMs,
		Metrics:       kairosQueries,
	}

	results, err := ds.KairosDBClient.QueryMetrics(ctx, dsRequest.Datasource, kairosRequest)
	if err != nil {
		return nil, err
	}

	dsResults := make([]*datasource.QueryResult, 0)

	for i, query := range results {
		qr := ds.ParseQueryResult(query)
		qr.RefId = refIds[i]
		dsResults = append(dsResults, qr)
	}

	return &datasource.DatasourceResponse{
		Results: dsResults,
	}, nil
}

func (ds *Datasource) CreateMetricQuery(dsQuery *datasource.Query) (*MetricQuery, error) {
	panelRequest := &panel.MetricRequest{}
	err := json.Unmarshal([]byte(dsQuery.ModelJson), panelRequest)
	if err != nil {
		ds.Logger.Debug("Failed to unmarshal JSON", "value", dsQuery.ModelJson)
		return nil, status.Errorf(codes.InvalidArgument, "failed to unmarshal request model: %v", err)
	}

	panelQuery := panelRequest.Query

	metricQuery := &MetricQuery{
		Name: panelQuery.Name,
	}

	tags := map[string][]string{}
	for name, values := range panelQuery.Tags {
		if len(values) > 0 {
			tags[name] = values
		}
	}

	if len(tags) > 0 {
		metricQuery.Tags = tags
	}

	var aggregators []map[string]interface{}
	for _, aggregator := range panelQuery.Aggregators {
		result, err := parseAggregator(aggregator)
		if err != nil {
			return nil, err
		}

		aggregators = append(aggregators, result)
	}

	if len(aggregators) > 0 {
		metricQuery.Aggregators = aggregators
	}

	groupby := panelQuery.GroupBy
	if groupby != nil {
		tagGroups := groupby.Tags
		if len(tagGroups) > 0 {
			metricQuery.GroupBy = []*Grouper{
				{
					Name: "tag",
					Tags: tagGroups,
				},
			}
		}
	}
	return metricQuery, nil
}

func parseAggregator(aggregator *panel.Aggregator) (map[string]interface{}, error) {
	result := map[string]interface{}{}
	result["name"] = aggregator.Name
	sampling := &Sampling{}

	for _, param := range aggregator.Parameters {
		switch param.Type {
		case "alignment":
			result["align_sampling"] = param.Value == "SAMPLING"
			result["align_start_time"] = param.Value == "START_TIME"
			result["align_end_time"] = false
		case "sampling":
			var err error
			sampling.Value, err = strconv.Atoi(param.Value)
			if err != nil {
				return nil, err
			}
		case "sampling_unit":
			sampling.Unit = param.Value
		default:
			var value interface{}
			value, err := strconv.ParseFloat(param.Value, 64)
			if err != nil {
				value = param.Value
			}
			result[param.Name] = value
		}
	}
	if sampling.Value != 0 && sampling.Unit != "" {
		result["sampling"] = sampling
	}

	return result, nil
}

func (ds *Datasource) ParseQueryResult(query *MetricQueryResults) *datasource.QueryResult {

	seriesSet := make([]*datasource.TimeSeries, 0)

	for _, result := range query.Results {
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
