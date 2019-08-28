System.register(["lodash", "../beans/aggregators/aggregators"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, aggregators_1;
    var __moduleName = context_1 && context_1.id;
    function AggregatorEditorLink(scope) {
        scope.newAggregator = null;
        scope.pickAggregator = function (aggregatorName) {
            if (aggregatorName) {
                scope.newAggregator = aggregators_1.fromObject(lodash_1.default.values(lodash_1.default.pickBy(scope.ctrl.availableAggregators, { name: aggregatorName }))[0]);
            }
        };
        scope.isAutoValue = function () {
            return !lodash_1.default.isNil(scope.newAggregator.autoValueSwitch) && scope.newAggregator.autoValueSwitch.enabled;
        };
    }
    function AggregatorEditorDirective() {
        return {
            link: AggregatorEditorLink,
            restrict: "E",
            scope: false,
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/aggregator.editor.html"
        };
    }
    exports_1("AggregatorEditorDirective", AggregatorEditorDirective);
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
        }
    };
});
//# sourceMappingURL=aggregator_editor.js.map