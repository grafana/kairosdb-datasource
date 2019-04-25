System.register(["./group_by"], function(exports_1) {
    var group_by_1;
    var KairosDBTarget;
    return {
        setters:[
            function (group_by_1_1) {
                group_by_1 = group_by_1_1;
            }],
        execute: function() {
            KairosDBTarget = (function () {
                function KairosDBTarget() {
                    this.metricName = undefined;
                    this.alias = undefined;
                    this.tags = {};
                    this.groupBy = new group_by_1.GroupBy();
                    this.aggregators = [];
                }
                return KairosDBTarget;
            })();
            exports_1("KairosDBTarget", KairosDBTarget);
        }
    }
});
//# sourceMappingURL=target.js.map