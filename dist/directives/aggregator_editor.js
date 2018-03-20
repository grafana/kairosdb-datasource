System.register(["lodash"], function(exports_1) {
    var lodash_1;
    function AggregatorEditorLink(scope) {
        scope.newAggregator = null;
        scope.pickAggregator = function (aggregatorName) {
            scope.newAggregator = lodash_1.default.cloneDeep(lodash_1.default.values(lodash_1.default.pickBy(scope.ctrl.availableAggregators, { name: aggregatorName }))[0]);
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
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=aggregator_editor.js.map