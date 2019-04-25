System.register(["lodash", "../../beans/aggregators/parameters/sampling_aggregator_parameter", "../../beans/aggregators/parameters/sampling_unit_aggregator_parameter"], function(exports_1) {
    var lodash_1, sampling_aggregator_parameter_1, sampling_unit_aggregator_parameter_1;
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
            }],
        execute: function() {
            SamplingParameterConverter = (function () {
                function SamplingParameterConverter(samplingConverter) {
                    this.samplingConverter = samplingConverter;
                }
                SamplingParameterConverter.prototype.convertSamplingParameters = function (aggregator) {
                    var parameters = aggregator.parameters;
                    var samplingParameterIndex = this.findParameterIndex(parameters, sampling_aggregator_parameter_1.SamplingAggregatorParameter.TYPE);
                    var samplingUnitParameterIndex = this.findParameterIndex(parameters, sampling_unit_aggregator_parameter_1.SamplingUnitAggregatorParameter.TYPE);
                    if (samplingParameterIndex > -1 && samplingUnitParameterIndex > -1) {
                        var samplingParameter = parameters[samplingParameterIndex];
                        var samplingUnitParameter = parameters[samplingUnitParameterIndex];
                        if (this.samplingConverter.isApplicable(samplingParameter.value)) {
                            var convertedSampling = this.samplingConverter.convert(samplingParameter.value, samplingUnitParameter.value);
                            samplingParameter.value = convertedSampling.interval;
                            samplingUnitParameter.value = convertedSampling.unit;
                        }
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