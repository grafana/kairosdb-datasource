System.register(["lodash", "./aggregator_editor"], function(exports_1) {
    var lodash_1;
    var AggregatorCtrl;
    function AggregatorDirective() {
        return {
            bindToController: true,
            controller: AggregatorCtrl,
            controllerAs: "ctrl",
            restrict: "E",
            scope: {
                onRemove: "&",
                value: "="
            },
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/aggregator.html"
        };
    }
    exports_1("AggregatorDirective", AggregatorDirective);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (_1) {}],
        execute: function() {
            AggregatorCtrl = (function () {
                function AggregatorCtrl() {
                    this.isAutoValue = false;
                    this.isAutoValue = !lodash_1.default.isNil(this.value.autoValueSwitch) && this.value.autoValueSwitch.enabled;
                }
                AggregatorCtrl.prototype.getVisibleParameters = function () {
                    if (this.isAutoValue) {
                        var dependentParametersTypes = this.value.autoValueSwitch.dependentParameters.map(function (parameter) { return parameter.type; });
                        return this.value.parameters.filter(function (parameter) { return !lodash_1.default.includes(dependentParametersTypes, parameter.type); });
                    }
                    else {
                        return this.value.parameters;
                    }
                };
                return AggregatorCtrl;
            })();
            exports_1("AggregatorCtrl", AggregatorCtrl);
        }
    }
});
//# sourceMappingURL=aggregator.js.map