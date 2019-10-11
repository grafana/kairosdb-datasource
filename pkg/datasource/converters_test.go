package datasource

import (
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"testing"
)

func TestMetricQueryConverterImpl_Convert_minimalQuery(t *testing.T) {
	converter := MetricQueryConverterImpl{}

	result, err := converter.Convert(&MetricQuery{
		Name: "MetricA",
	})

	assert.Nil(t, err)
	assert.Equal(t, &remote.MetricQuery{
		Name: "MetricA",
	}, result)
}

func TestMetricQueryConverterImpl_Convert_withTags(t *testing.T) {
	converter := MetricQueryConverterImpl{}

	result, err := converter.Convert(&MetricQuery{
		Name: "MetricA",
		Tags: map[string][]string{
			"foo":  {"bar", "baz"},
			"foo1": {},
		},
	})

	assert.Nil(t, err)
	assert.Equal(t, &remote.MetricQuery{
		Name: "MetricA",
		Tags: map[string][]string{
			"foo":  {"bar", "baz"},
			"foo1": {},
		},
	}, result)
}

func TestMetricQueryConverterImpl_Convert_WithAggregators(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAggregatorConverter := NewMockAggregatorConverter(ctrl)
	converter := MetricQueryConverterImpl{
		aggregatorConverter: mockAggregatorConverter,
	}

	aggregator := map[string]interface{}{
		"name":  "foo",
		"value": "baz",
	}

	mockAggregatorConverter.EXPECT().
		Convert(gomock.Any()).
		Return(aggregator, nil).
		AnyTimes()

	result, err := converter.Convert(&MetricQuery{
		Name: "MetricA",
		Aggregators: []*Aggregator{
			{},
			{},
		},
	})

	assert.Nil(t, err)
	assert.Equal(t, &remote.MetricQuery{
		Name: "MetricA",
		Aggregators: []map[string]interface{}{
			aggregator,
			aggregator,
		},
	}, result)
}

func TestMetricQueryConverterImpl_Convert_WithGroupBy(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockGroupByConverter := NewMockGroupByConverter(ctrl)
	converter := MetricQueryConverterImpl{
		groupByConverter: mockGroupByConverter,
	}

	groupers := []*remote.Grouper{
		{
			Name: "tag",
			Tags: []string{"host", "pool"},
		},
	}

	mockGroupByConverter.EXPECT().
		Convert(gomock.Any()).
		Return(groupers, nil).
		AnyTimes()

	result, err := converter.Convert(&MetricQuery{
		Name:    "MetricA",
		GroupBy: &GroupBy{},
	})

	assert.Nil(t, err)
	assert.Equal(t, &remote.MetricQuery{
		Name:    "MetricA",
		GroupBy: groupers,
	}, result)
}

func TestAggregatorConverterImpl_Convert_singleParam(t *testing.T) {
	converter := AggregatorConverterImpl{
		parameterConverterMappings: map[string]ParameterConverter{
			"foo": &StringParameterConverter{},
		},
	}
	result, err := converter.Convert(&Aggregator{
		Name: "test",
		Parameters: []*AggregatorParameter{
			{
				Type:  "foo",
				Name:  "key",
				Value: "value",
			},
		},
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"name": "test",
		"key":  "value",
	}, result)
}

func TestAggregatorConverterImpl_Convert_multipleParams(t *testing.T) {
	converter := AggregatorConverterImpl{
		parameterConverterMappings: map[string]ParameterConverter{
			"foo": &StringParameterConverter{},
		},
	}
	result, err := converter.Convert(&Aggregator{
		Name: "test",
		Parameters: []*AggregatorParameter{
			{
				Type:  "foo",
				Name:  "key1",
				Value: "value1",
			},
			{
				Type:  "foo",
				Name:  "key2",
				Value: "value2",
			},
		},
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"name": "test",
		"key1": "value1",
		"key2": "value2",
	}, result)
}

func TestAggregatorConverterImpl_Convert_invalidParamType(t *testing.T) {
	converter := AggregatorConverterImpl{}
	result, err := converter.Convert(&Aggregator{
		Name: "test",
		Parameters: []*AggregatorParameter{
			{
				Type: "bogus",
			},
		},
	})

	assert.Nil(t, result)
	assert.NotNil(t, err)
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
	assert.NotNil(t, err)
}

func TestSamplingParameterConverter_Convert_invalidFormat(t *testing.T) {
	converter := SamplingParameterConverter{}
	result, err := converter.Convert(&AggregatorParameter{
		Value: "",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "h",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "1",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "h1",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "1h1h",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&AggregatorParameter{
		Value: "1.5h",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)
}
