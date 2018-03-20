System.register([], function(exports_1) {
    var DatapointsQuery;
    return {
        setters:[],
        execute: function() {
            DatapointsQuery = (function () {
                function DatapointsQuery(startAbsolute, endAbsolute, metrics) {
                    this.cache_time = 0;
                    this.start_absolute = startAbsolute.unix() * 1000;
                    this.end_absolute = endAbsolute.unix() * 1000;
                    this.metrics = metrics;
                }
                return DatapointsQuery;
            })();
            exports_1("DatapointsQuery", DatapointsQuery);
        }
    }
});
//# sourceMappingURL=datapoints_query.js.map