package datasource

import (
	"fmt"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"regexp"
	"strconv"
)

func ParseAggregator(aggregator *Aggregator) (map[string]interface{}, error) {
	result := map[string]interface{}{}
	result["name"] = aggregator.Name
	sampling := &remote.Sampling{}

	for _, param := range aggregator.Parameters {
		switch param.Type {
		case "alignment":
			result["align_sampling"] = param.Value == "SAMPLING"
			result["align_start_time"] = param.Value == "START_TIME"
			result["align_end_time"] = false
		case "sampling":
			duration, err := parseDuration(param.Value)
			if err != nil {
				return nil, err
			}
			sampling.Value = duration.Value
			sampling.Unit = duration.Unit
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

type ParseError struct {
	message string
}

func (e *ParseError) Error() string {
	return e.message
}

type Duration struct {
	Value int64
	Unit  string
}

func parseDuration(str string) (*Duration, error) {
	regex := regexp.MustCompile(`([0-9]+)([a-zA-Z]+)`)
	matches := regex.FindStringSubmatch(str)

	if len(matches) == 0 || matches[0] != str {
		return nil, &ParseError{
			message: fmt.Sprintf("failed to parse duration - invalid format: '%s'", str),
		}
	}

	value, _ := strconv.ParseInt(matches[1], 10, 64)
	unit, ok := unitNameMappings[matches[2]]
	if !ok {
		return nil, &ParseError{
			message: fmt.Sprintf("failed to parse duration - invalid unit: '%s'", matches[2]),
		}
	}

	return &Duration{
		Value: value,
		Unit:  unit,
	}, nil
}
