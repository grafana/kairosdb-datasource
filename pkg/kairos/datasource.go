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

func (ds *Datasource) Query(ctx context.Context, request *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	req, err := ds.CreateMetricQueryRequest(request)
	if err != nil {
		return nil, err
	}

	results, err := ds.KairosDBClient.QueryMetrics(ctx, request.Datasource, req)
	if err != nil {
		return nil, err
	}

	return ds.ParseQueryResults(results), nil
}

func (ds *Datasource) CreateMetricQueryRequest(request *datasource.DatasourceRequest) (*MetricQueryRequest, error) {
	var kairosQueries []*MetricQuery

	for _, dsQuery := range request.Queries {
		query, err := ds.createMetricQuery(dsQuery)
		if err != nil {
			return nil, err
		}
		kairosQueries = append(kairosQueries, query)
	}

	return &MetricQueryRequest{
		StartAbsolute: request.TimeRange.FromEpochMs,
		EndAbsolute:   request.TimeRange.ToEpochMs,
		Metrics:       kairosQueries,
	}, nil
}

func (ds *Datasource) createMetricQuery(dsQuery *datasource.Query) (*MetricQuery, error) {
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

	aggregators := make([]*Aggregator, 0)
	for _, aggregator := range panelQuery.Aggregators {
		var timeValue int
		var unit string
		alignBy := "NONE"

		for _, param := range aggregator.Parameters {
			if param.Name == "value" {
				timeValue, _ = strconv.Atoi(param.Value)
			} else if param.Name == "sampling" {
				alignBy = param.Value
			} else if param.Name == "unit" {
				unit = param.Value
			}
		}

		aggregators = append(aggregators, &Aggregator{
			Name:           aggregator.Name,
			AlignSampling:  alignBy == "SAMPLING",
			AlignStartTime: alignBy == "START_TIME",
			AlignEndTime:   false,
			Sampling: &Sampling{
				Value: timeValue,
				Unit:  unit,
			},
		})
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

func (ds *Datasource) ParseQueryResults(queries []*MetricQueryResults) *datasource.DatasourceResponse {
	dsResults := make([]*datasource.QueryResult, 0)

	for _, query := range queries {
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

		//TODO add refID
		//TODO add any errors
		dsResults = append(dsResults, &datasource.QueryResult{
			Series: seriesSet,
		})
	}

	return &datasource.DatasourceResponse{
		Results: dsResults,
	}
}
