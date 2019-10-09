package datasource

import (
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"testing"
)

func TestAggregatorConverterImpl_Convert_invalidParamType(t *testing.T) {
	converter := AggregatorConverterImpl{}
	result, err := converter.Convert(&Aggregator{
		Name: "foo",
		Parameters: []*AggregatorParameter{
			{
				Type: "bogus",
			},
		},
	})

	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)
}

func TestStringParameterConverter_Convert(t *testing.T) {
	converter := StringParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Name:  "unit",
		Value: "MINUTES",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"unit": "MINUTES",
	}, result)
}

func TestAnyParameterConverter_Convert_float(t *testing.T) {
	converter := AnyParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Name:  "value",
		Value: "1.5",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"value": 1.5,
	}, result)
}

func TestAnyParameterConverter_Convert_string(t *testing.T) {
	converter := AnyParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Name:  "value",
		Value: "string",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"value": "string",
	}, result)
}

func TestAlignmentParameterConverter_Convert(t *testing.T) {
	converter := AlignmentParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Value: "SAMPLING",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"align_sampling":   true,
		"align_start_time": false,
	}, result)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "START_TIME",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"align_sampling":   false,
		"align_start_time": true,
	}, result)
}

func TestSamplingParameterConverter_Convert(t *testing.T) {
	converter := SamplingParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Value: "1h",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"sampling": &remote.Sampling{
			Value: 1,
			Unit:  "hours",
		},
	}, result)

	converter = SamplingParameterConverter{}
	result, err = converter.Convert(&AggregatorParameter{
		Value: "10ms",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"sampling": &remote.Sampling{
			Value: 10,
			Unit:  "milliseconds",
		},
	}, result)
}

func TestSamplingParameterConverter_Convert_invalidUnit(t *testing.T) {
	converter := SamplingParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Value: "1x",
	})
	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)
}

func TestSamplingParameterConverter_Convert_invalidFormat(t *testing.T) {
	converter := SamplingParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Value: "",
	})
	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "h",
	})
	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "1",
	})
	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "h1",
	})
	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "1h1h",
	})
	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "1.5h",
	})
	assert.Nil(t, result)
	assert.IsType(t, &ParseError{}, err)
}
