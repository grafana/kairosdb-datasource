System.register([], function (exports_1, context_1) {
    "use strict";
    var MetricQuery;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            MetricQuery = (function () {
                function MetricQuery(name, tags, aggregators, group_by, start_absolute, end_absolute) {
                    this.limit = 0;
                    this.name = name;
                    this.tags = tags;
                    this.aggregators = aggregators;
                    this.group_by = group_by;
                    this.start_absolute = start_absolute;
                    this.end_absolute = end_absolute;
                }
                return MetricQuery;
            }());
            exports_1("MetricQuery", MetricQuery);
        }
    };
});
//# sourceMappingURL=metric_query.js.map