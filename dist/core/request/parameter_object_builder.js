System.register(["lodash", "../../beans/aggregators/utils", "../../utils/time_unit_utils"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, utils_1, time_unit_utils_1, ParameterObjectBuilder;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (time_unit_utils_1_1) {
                time_unit_utils_1 = time_unit_utils_1_1;
            }
        ],
        execute: function () {
            ParameterObjectBuilder = (function () {
                function ParameterObjectBuilder(interval, autoValueSwitch, snapToIntervals) {
                    var _a;
                    this.autoValueDependentParameters = [];
                    this.autoValueEnabled = !lodash_1.default.isNil(autoValueSwitch) && autoValueSwitch.enabled;
                    if (this.autoValueEnabled) {
                        this.autoValueDependentParameters = autoValueSwitch.dependentParameters
                            .map(function (parameter) { return parameter.type; });
                    }
                    if (snapToIntervals && snapToIntervals.length > 0) {
                        _a = time_unit_utils_1.TimeUnitUtils.ceilingToAvailableUnit(interval, snapToIntervals), this.autoIntervalUnit = _a[0], this.autoIntervalValue = _a[1];
                    }
                    else {
                        var _b = time_unit_utils_1.TimeUnitUtils.intervalToUnitValue(interval), unit = _b[0], value = _b[1];
                        this.autoIntervalValue = value.toString();
                        this.autoIntervalUnit = utils_1.TimeUnit[unit];
                    }
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
                        this.isOverriddenByAutoValue(parameter) ? autoValue : parameter.value;
                    return parameterObject;
                };
                ParameterObjectBuilder.prototype.buildDefault = function (parameter) {
                    var parameterObject = {};
                    parameterObject[parameter.name] = parameter.value;
                    return parameterObject;
                };
                ParameterObjectBuilder.prototype.isOverriddenByAutoValue = function (parameter) {
                    return lodash_1.default.includes(this.autoValueDependentParameters, parameter.type);
                };
                return ParameterObjectBuilder;
            }());
            exports_1("ParameterObjectBuilder", ParameterObjectBuilder);
        }
    };
});
//# sourceMappingURL=parameter_object_builder.js.map