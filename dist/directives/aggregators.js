System.register(["lodash", "./aggregator_editor"], function(exports_1) {
    var lodash_1;
    var AggregatorsCtrl;
    function AggregatorsDirective() {
        return {
            bindToController: true,
            controller: AggregatorsCtrl,
            controllerAs: "ctrl",
            restrict: "E",
            scope: {
                availableAggregators: "=",
                entries: "="
            },
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/aggregators.html"
        };
    }
    exports_1("AggregatorsDirective", AggregatorsDirective);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (_1) {}],
        execute: function() {
            AggregatorsCtrl = (function () {
                function AggregatorsCtrl() {
                }
                AggregatorsCtrl.prototype.add = function (entry) {
                    this.entries.push(entry);
                };
                AggregatorsCtrl.prototype.remove = function (entry) {
                    this.entries = lodash_1.default.without(this.entries, entry);
                };
                return AggregatorsCtrl;
            })();
            exports_1("AggregatorsCtrl", AggregatorsCtrl);
        }
    }
});
//# sourceMappingURL=aggregators.js.map