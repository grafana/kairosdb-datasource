System.register(["lodash", "../../beans/aggregators/utils"], function(exports_1) {
    var lodash_1, utils_1;
    var GroupByTimeCtrl;
    function GroupByTimeDirective() {
        return {
            bindToController: true,
            controller: GroupByTimeCtrl,
            controllerAs: "ctrl",
            restrict: "E",
            scope: {
                entries: "="
            },
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/group.by.time.html"
        };
    }
    exports_1("GroupByTimeDirective", GroupByTimeDirective);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            GroupByTimeCtrl = (function () {
                function GroupByTimeCtrl() {
                    this.inputVisible = false;
                    this.allowedUnitValues = utils_1.EnumValues(utils_1.TimeUnit);
                    this.entries = this.entries || [];
                }
                GroupByTimeCtrl.prototype.add = function (entry) {
                    if (this.isValidEntry(entry)) {
                        this.entries.push(entry);
                    }
                    this.inputVisible = !this.inputVisible;
                };
                GroupByTimeCtrl.prototype.remove = function (entry) {
                    this.entries = lodash_1.default.without(this.entries, entry);
                };
                GroupByTimeCtrl.prototype.isValidEntry = function (entry) {
                    return !isNaN(entry.interval) && !isNaN(entry.count);
                };
                return GroupByTimeCtrl;
            })();
            exports_1("GroupByTimeCtrl", GroupByTimeCtrl);
        }
    }
});
//# sourceMappingURL=group_by_time.js.map