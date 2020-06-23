System.register(["lodash", "../../beans/aggregators/aggregators"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, aggregators_1, TargetValidator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (aggregators_1_1) {
                aggregators_1 = aggregators_1_1;
            }
        ],
        execute: function () {
            TargetValidator = (function () {
                function TargetValidator(enforceScalarSetting) {
                    this.enforceScalarSetting = enforceScalarSetting;
                }
                TargetValidator.prototype.areValidTargets = function (targets) {
                    var _this = this;
                    if (lodash_1.default.isNil(targets) || lodash_1.default.isEmpty(targets)) {
                        return {
                            valid: false,
                            reason: "No configured queries.",
                        };
                    }
                    var anyFailures = targets
                        .map(function (target) { return _this.isValidTarget(target.query); })
                        .filter(function (resp) { return !resp.valid; });
                    return !lodash_1.default.isEmpty(anyFailures) ? anyFailures[0] : { valid: true };
                };
                TargetValidator.prototype.isValidTarget = function (target) {
                    if (lodash_1.default.isNil(target) || lodash_1.default.isEmpty(target.metricName)) {
                        return {
                            valid: false,
                            reason: "An active query has no selected metric.",
                        };
                    }
                    if (this.enforceScalarSetting && !target.overrideScalar) {
                        if (target.aggregators == null || target.aggregators.length === 0) {
                            return {
                                valid: false,
                                reason: "At least one scalar aggregator required for your query on \"" + target.metricName + "\""
                            };
                        }
                        var valid = target.aggregators.reduce(function (found, aggregator) {
                            return found || aggregators_1.SCALAR_AGGREGATOR_NAMES.indexOf(aggregator.name) !== -1;
                        }, false);
                        return valid ? { valid: valid } : {
                            valid: false,
                            reason: "At least one scalar aggregator required for your query on \"" + target.metricName + "\"."
                        };
                    }
                    return {
                        valid: true,
                    };
                };
                return TargetValidator;
            }());
            exports_1("TargetValidator", TargetValidator);
        }
    };
});
//# sourceMappingURL=target_validator.js.map