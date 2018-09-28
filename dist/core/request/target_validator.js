System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var TargetValidator;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            TargetValidator = (function () {
                function TargetValidator() {
                }
                TargetValidator.prototype.areValidTargets = function (targets) {
                    var _this = this;
                    return targets && targets.every(function (target) { return _this.isValidTarget(target.query); });
                };
                TargetValidator.prototype.isValidTarget = function (target) {
                    return !lodash_1.default.isNil(target) && !lodash_1.default.isEmpty(target.metricName);
                };
                return TargetValidator;
            })();
            exports_1("TargetValidator", TargetValidator);
        }
    }
});
//# sourceMappingURL=target_validator.js.map