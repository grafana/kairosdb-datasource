System.register(["lodash", "../../beans/aggregators/parameters/sampling_aggregator_parameter", "../../beans/aggregators/parameters/sampling_unit_aggregator_parameter", "../../utils/time_unit_utils"], function(exports_1) {
    var lodash_1, sampling_aggregator_parameter_1, sampling_unit_aggregator_parameter_1, time_unit_utils_1;
    var SamplingParameterConverter;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sampling_aggregator_parameter_1_1) {
                sampling_aggregator_parameter_1 = sampling_aggregator_parameter_1_1;
            },
            function (sampling_unit_aggregator_parameter_1_1) {
                sampling_unit_aggregator_parameter_1 = sampling_unit_aggregator_parameter_1_1;
            },
            function (time_unit_utils_1_1) {
                time_unit_utils_1 = time_unit_utils_1_1;
            }],
        execute: function() {
            SamplingParameterConverter = (function () {
                function SamplingParameterConverter(samplingConverter) {
                    this.samplingConverter = samplingConverter;
                }
                SamplingParameterConverter.prototype.convertSamplingParameters = function (aggregator) {
                    var parameters = aggregator.parameters;
                    var samplingParameterIndex = this.findParameterIndex(parameters, sampling_aggregator_parameter_1.SamplingAggregatorParameter.TYPE);
                    if (samplingParameterIndex > -1) {
                        var samplingParameter = parameters[samplingParameterIndex];
                        var relativeTime = time_unit_utils_1.TimeUnitUtils.convertFromInterval(samplingParameter.value);
                        var samplingUnitAggregatorParameter = new sampling_unit_aggregator_parameter_1.SamplingUnitAggregatorParameter();
                        if (this.samplingConverter.isApplicable(relativeTime.value)) {
                            var convertedSampling = this.samplingConverter.convert(relativeTime.value, relativeTime.unit);
                            samplingParameter.value = convertedSampling.interval;
                            samplingUnitAggregatorParameter.value = convertedSampling.unit;
                        }
                        else {
                            samplingParameter.value = relativeTime.value;
                            samplingUnitAggregatorParameter.value = relativeTime.unit;
                        }
                        parameters.push(samplingUnitAggregatorParameter);
                    }
                    return aggregator;
                };
                SamplingParameterConverter.prototype.findParameterIndex = function (parameters, type) {
                    return lodash_1.default.findIndex(parameters, function (parameter) { return parameter.type === type; });
                };
                return SamplingParameterConverter;
            })();
            exports_1("SamplingParameterConverter", SamplingParameterConverter);
        }
    }
});
//# sourceMappingURL=sampling_parameter_converter.js.map