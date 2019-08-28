System.register(["lodash", "./aggregator_editor"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, AggregatorCtrl;
    var __moduleName = context_1 && context_1.id;
    function AggregatorDirective() {
        return {
            bindToController: true,
            controller: AggregatorCtrl,
            controllerAs: "ctrl",
            restrict: "E",
            scope: {
                onRemove: "&",
                onUp: "&",
                onDown: "&",
                value: "=",
                isFirst: "=",
                isLast: "="
            },
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/aggregator.html"
        };
    }
    exports_1("AggregatorDirective", AggregatorDirective);
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (_1) {
            }
        ],
        execute: function () {
            AggregatorCtrl = (function () {
                function AggregatorCtrl() {
                    this.isAutoValue = false;
                    this.isAutoValue = !lodash_1.default.isNil(this.value.autoValueSwitch) && this.value.autoValueSwitch.enabled;
                    this.visibleParameters = this.isAutoValue ? this.getVisibleParameters() : this.value.parameters;
                }
                AggregatorCtrl.prototype.getVisibleParameters = function () {
                    var dependentParametersTypes = this.value.autoValueSwitch.dependentParameters.map(function (parameter) { return parameter.type; });
                    return this.value.parameters.filter(function (parameter) { return !lodash_1.default.includes(dependentParametersTypes, parameter.type); });
                };
                return AggregatorCtrl;
            }());
            exports_1("AggregatorCtrl", AggregatorCtrl);
        }
    };
});
//# sourceMappingURL=aggregator.js.map