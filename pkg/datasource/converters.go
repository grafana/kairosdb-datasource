package datasource

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"regexp"
	"strconv"
)

type ParseError struct {
	message string
}

func (e *ParseError) Error() string {
	return e.message
}

type MetricQueryConverter interface {
	Convert(query *MetricQuery) (*remote.MetricQuery, error)
}

type MetricQueryConverterImpl struct {
	AggregatorConverter AggregatorConverter
	GroupByConverter    GroupByConverter
}

func (c MetricQueryConverterImpl) Convert(query *MetricQuery) (*remote.MetricQuery, error) {
	remoteQuery := &remote.MetricQuery{
		Name: query.Name,
		Tags: query.Tags,
	}

	for _, aggregator := range query.Aggregators {
		result, err := c.AggregatorConverter.Convert(aggregator)
		if err != nil {
			return nil, err
		}
		remoteQuery.Aggregators = append(remoteQuery.Aggregators, result)
	}

	if query.GroupBy != nil {
		result, err := c.GroupByConverter.Convert(query.GroupBy)
		if err != nil {
			return nil, err
		}
		remoteQuery.GroupBy = result
	}
	return remoteQuery, nil
}

type GroupByConverter interface {
	Convert(groupBy *GroupBy) ([]*remote.Grouper, error)
}

type GroupByConverterImpl struct{}

func (c GroupByConverterImpl) Convert(groupBy *GroupBy) ([]*remote.Grouper, error) {
	var result []*remote.Grouper
	tagGroups := groupBy.Tags
	if len(tagGroups) > 0 {
		result = []*remote.Grouper{
			{
				Name: "tag",
				Tags: tagGroups,
			},
		}
	}
	return result, nil
}

type AggregatorConverter interface {
	Convert(aggregator *Aggregator) (map[string]interface{}, error)
}

type AggregatorConverterImpl struct {
	ParameterConverterMappings map[string]ParameterConverter
}

func (c AggregatorConverterImpl) Convert(aggregator *Aggregator) (map[string]interface{}, error) {
	result := map[string]interface{}{}
	result["name"] = aggregator.Name

	for _, param := range aggregator.Parameters {
		converter := c.ParameterConverterMappings[param.Type]
		if converter == nil {
			return nil, &ParseError{
				message: fmt.Sprintf("failed to parse aggregator: %s - unknown parameter type: %s", aggregator.Name, param.Type),
			}
		}

		object, err := converter.Convert(param)
		if err != nil {
			return nil, errors.Wrapf(err, "failed to parse aggregator: %s", aggregator.Name)
		}

		result = mergeMaps(result, object)
	}
	return result, nil
}

func mergeMaps(a map[string]interface{}, b map[string]interface{}) map[string]interface{} {
	result := map[string]interface{}{}
	for k, v := range a {
		result[k] = v
	}

	for k, v := range b {
		result[k] = v
	}
	return result
}

type ParameterConverter interface {
	Convert(param *AggregatorParameter) (map[string]interface{}, error)
}

type StringParameterConverter struct{}

func (c StringParameterConverter) Convert(param *AggregatorParameter) (map[string]interface{}, error) {
	return map[string]interface{}{
		param.Name: param.Value,
	}, nil
}

type AnyParameterConverter struct{}

func (c AnyParameterConverter) Convert(param *AggregatorParameter) (map[string]interface{}, error) {
	var value interface{}
	value, err := strconv.ParseFloat(param.Value, 64)
	if err != nil {
		value = param.Value
	}
	return map[string]interface{}{
		param.Name: value,
	}, nil
}

type AlignmentParameterConverter struct{}

func (c AlignmentParameterConverter) Convert(param *AggregatorParameter) (map[string]interface{}, error) {
	return map[string]interface{}{
		"align_sampling":   param.Value == "SAMPLING",
		"align_start_time": param.Value == "START_TIME",
	}, nil
}

const (
	MILLISECONDS = "milliseconds"
	SECONDS      = "seconds"
	MINUTES      = "minutes"
	HOURS        = "hours"
	DAYS         = "days"
	WEEKS        = "weeks"
	MONTHS       = "months"
	YEARS        = "years"
)

var unitNameMappings = map[string]string{
	"ms": MILLISECONDS,
	"s":  SECONDS,
	"m":  MINUTES,
	"h":  HOURS,
	"d":  DAYS,
	"w":  WEEKS,
	"M":  MONTHS,
	"y":  YEARS,
}

type SamplingParameterConverter struct{}

func (c SamplingParameterConverter) Convert(param *AggregatorParameter) (map[string]interface{}, error) {
	regex := regexp.MustCompile(`([0-9]+)([a-zA-Z]+)`)
	matches := regex.FindStringSubmatch(param.Value)

	if len(matches) == 0 || matches[0] != param.Value {
		return nil, &ParseError{
			message: fmt.Sprintf("failed to parse sampling - invalid format: '%s'", param.Value),
		}
	}

	value, _ := strconv.ParseInt(matches[1], 10, 64)
	unit, ok := unitNameMappings[matches[2]]
	if !ok {
		return nil, &ParseError{
			message: fmt.Sprintf("failed to parse sampling - invalid unit: '%s'", matches[2]),
		}
	}

	return map[string]interface{}{
		"sampling": &remote.Sampling{
			Value: value,
			Unit:  unit,
		},
	}, nil
}
