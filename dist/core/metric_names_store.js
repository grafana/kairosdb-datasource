System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var MetricNamesStore;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            MetricNamesStore = (function () {
                function MetricNamesStore(datasource, promiseUtils, datasourceUrl) {
                    this.initialized = false;
                    this.cacheKey = "KAIROSDB_METRIC_NAMES_" + datasourceUrl;
                    this.promiseUtils = promiseUtils;
                    this.datasource = datasource;
                }
                MetricNamesStore.prototype.getMetricNames = function () {
                    if (this.cacheInitialized()) {
                        return this.promiseUtils.resolvedPromise(this.metricNames);
                    }
                    else if (this.fetchingPromise) {
                        return this.fetchingPromise;
                    }
                    else {
                        return this.fetch();
                    }
                };
                MetricNamesStore.prototype.cacheInitialized = function () {
                    return !lodash_1.default.isUndefined(window[this.cacheKey]);
                };
                MetricNamesStore.prototype.fetch = function () {
                    var _this = this;
                    this.fetchingPromise = this.datasource.getMetricNames()
                        .then(function (response) { return response.data.results; })
                        .then(function (metricNames) {
                        _this.metricNames = metricNames;
                        window[_this.cacheKey] = metricNames;
                        _this.initialized = true;
                        return _this.metricNames;
                    });
                    return this.fetchingPromise;
                };
                return MetricNamesStore;
            })();
            exports_1("MetricNamesStore", MetricNamesStore);
        }
    }
});
//# sourceMappingURL=metric_names_store.js.map