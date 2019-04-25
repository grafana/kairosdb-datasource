System.register([], function(exports_1) {
    var MetricQuery;
    return {
        setters:[],
        execute: function() {
            MetricQuery = (function () {
                function MetricQuery(name, tags, aggregators, group_by) {
                    this.limit = 0;
                    this.name = name;
                    this.tags = tags;
                    this.aggregators = aggregators;
                    this.group_by = group_by;
                }
                return MetricQuery;
            })();
            exports_1("MetricQuery", MetricQuery);
        }
    }
});
//# sourceMappingURL=metric_query.js.map