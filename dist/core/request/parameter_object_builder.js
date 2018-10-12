System.register(["lodash", "../../utils/time_unit_utils"], function(exports_1) {
    var lodash_1, time_unit_utils_1;
    var ParameterObjectBuilder;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (time_unit_utils_1_1) {
                time_unit_utils_1 = time_unit_utils_1_1;
            }],
        execute: function() {
            ParameterObjectBuilder = (function () {
                function ParameterObjectBuilder(interval, autoValueSwitch) {
                    this.autoValueDependentParameters = [];
                    this.autoValueEnabled = !lodash_1.default.isNil(autoValueSwitch) && autoValueSwitch.enabled;
                    if (this.autoValueEnabled) {
                        this.autoValueDependentParameters = autoValueSwitch.dependentParameters
                            .map(function (parameter) { return parameter.type; });
                    }
                    var relativeTime = time_unit_utils_1.TimeUnitUtils.convertFromInterval(interval);
                    this.autoIntervalValue = relativeTime.value;
                    this.autoIntervalUnit = relativeTime.unit;
                }
                ParameterObjectBuilder.prototype.build = function (parameter) {
                    switch (parameter.type) {
                        case "alignment":
                            return this.buildAlignmentParameter(parameter);
                        case "sampling":
                            return this.buildSamplingParameter(parameter, this.autoIntervalValue);
                        case "sampling_unit":
                            return this.buildSamplingParameter(parameter, this.autoIntervalUnit);
                        default:
                            return this.buildDefault(parameter);
                    }
                };
                ParameterObjectBuilder.prototype.buildAlignmentParameter = function (parameter) {
                    switch (parameter.value) {
                        case "NONE":
                            return {};
                        case "START_TIME":
                            return {
                                align_start_time: true
                            };
                        case "SAMPLING":
                            return {
                                align_sampling: true
                            };
                        default:
                            throw new Error("Unknown alignment type");
                    }
                };
                ParameterObjectBuilder.prototype.buildSamplingParameter = function (parameter, autoValue) {
                    var parameterObject = { sampling: {} };
                    parameterObject.sampling[parameter.name] =
                        this.autoValueEnabled ? autoValue : parameter.value;
                    return parameterObject;
                };
                ParameterObjectBuilder.prototype.buildDefault = function (parameter) {
                    var parameterObject = {};
                    parameterObject[parameter.name] = parameter.value;
                    return parameterObject;
                };
                return ParameterObjectBuilder;
            })();
            exports_1("ParameterObjectBuilder", ParameterObjectBuilder);
        }
    }
});
//# sourceMappingURL=parameter_object_builder.js.map