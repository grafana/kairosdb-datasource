package datasource_test

import (
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"github.com/zsabin/kairosdb-datasource/pkg/datasource"
	"github.com/zsabin/kairosdb-datasource/pkg/datasource/internal/mock_datasource"
	"github.com/zsabin/kairosdb-datasource/pkg/remote"
	"testing"
)

func TestMetricQueryConverterImpl_Convert_minimalQuery(t *testing.T) {
	converter := datasource.MetricQueryConverterImpl{}

	result, err := converter.Convert(&datasource.MetricQuery{
		Name: "MetricA",
	})

	assert.Nil(t, err)
	assert.Equal(t, &remote.MetricQuery{
		Name: "MetricA",
	}, result)
}

func TestMetricQueryConverterImpl_Convert_withTags(t *testing.T) {
	converter := datasource.MetricQueryConverterImpl{}

	result, err := converter.Convert(&datasource.MetricQuery{
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

	mockAggregatorConverter := mock_datasource.NewMockAggregatorConverter(ctrl)
	mockGroupByConverter := mock_datasource.NewMockGroupByConverter(ctrl)
	converter := datasource.NewMetricQueryConverterImpl(mockAggregatorConverter, mockGroupByConverter)

	aggregator := map[string]interface{}{
		"name":  "foo",
		"value": "baz",
	}

	mockAggregatorConverter.EXPECT().
		Convert(gomock.Any()).
		Return(aggregator, nil).
		AnyTimes()

	result, err := converter.Convert(&datasource.MetricQuery{
		Name: "MetricA",
		Aggregators: []*datasource.Aggregator{
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

	mockAggregatorConverter := mock_datasource.NewMockAggregatorConverter(ctrl)
	mockGroupByConverter := mock_datasource.NewMockGroupByConverter(ctrl)
	converter := datasource.NewMetricQueryConverterImpl(mockAggregatorConverter, mockGroupByConverter)

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

	result, err := converter.Convert(&datasource.MetricQuery{
		Name:    "MetricA",
		GroupBy: &datasource.GroupBy{},
	})

	assert.Nil(t, err)
	assert.Equal(t, &remote.MetricQuery{
		Name:    "MetricA",
		GroupBy: groupers,
	}, result)
}

func TestGroupByConverterImpl_Convert_noTags(t *testing.T) {
	converter := datasource.GroupByConverterImpl{}

	result, err := converter.Convert(&datasource.GroupBy{
		Tags: nil,
	})

	assert.Nil(t, err)
	assert.Equal(t, []*remote.Grouper{}, result)
}

func TestGroupByConverterImpl_Convert(t *testing.T) {
	converter := datasource.GroupByConverterImpl{}

	result, err := converter.Convert(&datasource.GroupBy{
		Tags: []string{"foo", "bar"},
	})

	assert.Nil(t, err)
	assert.Equal(t, []*remote.Grouper{
		{
			Name: "tag",
			Tags: []string{"foo", "bar"},
		},
	}, result)
}

func TestAggregatorConverterImpl_Convert_singleParam(t *testing.T) {
	converter := datasource.NewAggregatorConverterImpl(map[string]datasource.ParameterConverter{
		"foo": &datasource.StringParameterConverter{},
	})

	result, err := converter.Convert(&datasource.Aggregator{
		Name: "test",
		Parameters: []*datasource.AggregatorParameter{
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
	converter := datasource.NewAggregatorConverterImpl(map[string]datasource.ParameterConverter{
		"foo": &datasource.StringParameterConverter{},
	})

	result, err := converter.Convert(&datasource.Aggregator{
		Name: "test",
		Parameters: []*datasource.AggregatorParameter{
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
	converter := datasource.AggregatorConverterImpl{}
	result, err := converter.Convert(&datasource.Aggregator{
		Name: "test",
		Parameters: []*datasource.AggregatorParameter{
			{
				Type: "bogus",
			},
		},
	})

	assert.Nil(t, result)
	assert.NotNil(t, err)
}

func TestStringParameterConverter_Convert(t *testing.T) {
	converter := datasource.StringParameterConverter{}
	result, err := converter.Convert(&datasource.AggregatorParameter{
		Name:  "unit",
		Value: "MINUTES",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"unit": "MINUTES",
	}, result)
}

func TestAnyParameterConverter_Convert_float(t *testing.T) {
	converter := datasource.AnyParameterConverter{}
	result, err := converter.Convert(&datasource.AggregatorParameter{
		Name:  "value",
		Value: "1.5",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"value": 1.5,
	}, result)
}

func TestAnyParameterConverter_Convert_string(t *testing.T) {
	converter := datasource.AnyParameterConverter{}
	result, err := converter.Convert(&datasource.AggregatorParameter{
		Name:  "value",
		Value: "string",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"value": "string",
	}, result)
}

func TestAlignmentParameterConverter_Convert(t *testing.T) {
	converter := datasource.AlignmentParameterConverter{}
	result, err := converter.Convert(&datasource.AggregatorParameter{
		Value: "SAMPLING",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"align_sampling":   true,
		"align_start_time": false,
	}, result)

	result, err = converter.Convert(&datasource.AggregatorParameter{
		Value: "START_TIME",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"align_sampling":   false,
		"align_start_time": true,
	}, result)
}

func TestSamplingParameterConverter_Convert(t *testing.T) {
	converter := datasource.SamplingParameterConverter{}
	result, err := converter.Convert(&datasource.AggregatorParameter{
		Value: "1h",
	})

	assert.Nil(t, err)
	assert.Equal(t, map[string]interface{}{
		"sampling": &remote.Sampling{
			Value: 1,
			Unit:  "hours",
		},
	}, result)

	converter = datasource.SamplingParameterConverter{}
	result, err = converter.Convert(&datasource.AggregatorParameter{
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
	converter := datasource.SamplingParameterConverter{}
	result, err := converter.Convert(&datasource.AggregatorParameter{
		Value: "1x",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)
}

func TestSamplingParameterConverter_Convert_invalidFormat(t *testing.T) {
	converter := datasource.SamplingParameterConverter{}
	result, err := converter.Convert(&datasource.AggregatorParameter{
		Value: "",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&datasource.AggregatorParameter{
		Value: "h",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&datasource.AggregatorParameter{
		Value: "1",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&datasource.AggregatorParameter{
		Value: "h1",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&datasource.AggregatorParameter{
		Value: "1h1h",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)

	result, err = converter.Convert(&datasource.AggregatorParameter{
		Value: "1.5h",
	})
	assert.Nil(t, result)
	assert.NotNil(t, err)
}
