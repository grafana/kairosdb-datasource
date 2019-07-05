System.register(["lodash", "../../beans/request/datapoints_query", "../../beans/request/metric_query", "../../utils/templating_utils", "./group_bys_builder", "./parameter_object_builder", "./sampling_converter", "./sampling_parameter_converter"], function(exports_1) {
    var lodash_1, datapoints_query_1, metric_query_1, templating_utils_1, group_bys_builder_1, parameter_object_builder_1, sampling_converter_1, sampling_parameter_converter_1;
    var KairosDBQueryBuilder;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (datapoints_query_1_1) {
                datapoints_query_1 = datapoints_query_1_1;
            },
            function (metric_query_1_1) {
                metric_query_1 = metric_query_1_1;
            },
            function (templating_utils_1_1) {
                templating_utils_1 = templating_utils_1_1;
            },
            function (group_bys_builder_1_1) {
                group_bys_builder_1 = group_bys_builder_1_1;
            },
            function (parameter_object_builder_1_1) {
                parameter_object_builder_1 = parameter_object_builder_1_1;
            },
            function (sampling_converter_1_1) {
                sampling_converter_1 = sampling_converter_1_1;
            },
            function (sampling_parameter_converter_1_1) {
                sampling_parameter_converter_1 = sampling_parameter_converter_1_1;
            }],
        execute: function() {
            KairosDBQueryBuilder = (function () {
                function KairosDBQueryBuilder(withCredentials, url, apiPath, templateSrv, scopedVars) {
                    this.withCredentials = withCredentials;
                    this.url = url;
                    this.apiPath = apiPath;
                    this.scopedVars = scopedVars;
                    this.templateSrv = templateSrv;
                    this.templatingUtils = new templating_utils_1.TemplatingUtils(templateSrv, this.scopedVars);
                    var samplingConverter = new sampling_converter_1.SamplingConverter();
                    this.groupBysBuilder = new group_bys_builder_1.GroupBysBuilder(this.templatingUtils, samplingConverter);
                    this.samplingParameterConverter = new sampling_parameter_converter_1.SamplingParameterConverter(samplingConverter);
                }
                KairosDBQueryBuilder.prototype.buildMetricNameQuery = function () {
                    return this.buildRequest({
                        method: "GET",
                        url: "/metricnames"
                    });
                };
                KairosDBQueryBuilder.prototype.buildMetricTagsQuery = function (metricName, filters) {
                    if (filters === void 0) { filters = {}; }
                    return this.buildRequest({
                        data: this.buildTagsRequestBody(metricName, filters),
                        method: "POST",
                        url: "/datapoints/query/tags"
                    });
                };
                KairosDBQueryBuilder.prototype.buildDatapointsQuery = function (targets, options) {
                    var _this = this;
                    var range = options.range;
                    var panelId = options.panelId;
                    var defaultInterval = options.interval;
                    var requests = targets.map(function (target) { return _this.buildMetricQuery(target.query, defaultInterval); }), data = new datapoints_query_1.DatapointsQuery(range.from, range.to, requests);
                    return this.buildRequest({
                        data: data,
                        method: "POST",
                        requestId: this.buildRequestId("metric_names", panelId),
                        url: "/datapoints/query"
                    });
                };
                KairosDBQueryBuilder.prototype.buildMetricQuery = function (target, defaultInterval) {
                    var _this = this;
                    return new metric_query_1.MetricQuery(target.metricName, this.unpackTags(lodash_1.default.pickBy(target.tags, function (tagValues) { return tagValues.length; })), target.aggregators.map(function (aggregator) { return _this.convertAggregatorToQueryObject(aggregator, defaultInterval); }), this.groupBysBuilder.build(target.groupBy));
                };
                KairosDBQueryBuilder.prototype.unpackTags = function (tags) {
                    var _this = this;
                    return lodash_1.default.mapValues.bind(this)(tags, function (values) { return lodash_1.default.flatten(_this.templatingUtils.replaceAll(values)); });
                };
                KairosDBQueryBuilder.prototype.convertAggregatorToQueryObject = function (aggregatorDefinition, defaultInterval) {
                    var convertedAggregator = this.samplingParameterConverter.convertSamplingParameters(lodash_1.default.cloneDeep(aggregatorDefinition));
                    return lodash_1.default.extend({ name: convertedAggregator.name }, this.convertParameters(convertedAggregator, defaultInterval));
                };
                KairosDBQueryBuilder.prototype.convertParameters = function (aggregatorDefinition, defaultInterval) {
                    var parameterObjectBuilder = new parameter_object_builder_1.ParameterObjectBuilder(defaultInterval, aggregatorDefinition.autoValueSwitch);
                    return aggregatorDefinition.parameters.map(function (parameter) { return parameterObjectBuilder.build(parameter); })
                        .reduce(function (param1, param2) { return lodash_1.default.merge(param1, param2); }, {});
                };
                KairosDBQueryBuilder.prototype.buildRequest = function (requestStub) {
                    requestStub.url = this.buildUrl(requestStub.url);
                    var grafanaCookie = "";
                    var match = document.cookie.match("grafana_kairos_token=([^;]+)");
                    if (match) {
                        grafanaCookie = match[1];
                    }
                    return lodash_1.default.extend(requestStub, {
                        withCredentials: this.withCredentials,
                        headers: { "X-Grafana-Token": grafanaCookie }
                    });
                };
                KairosDBQueryBuilder.prototype.buildRequestId = function (actionName, panelId) {
                    return actionName + "_" + panelId;
                };
                KairosDBQueryBuilder.prototype.buildUrl = function (urlStub) {
                    return this.url + this.apiPath + urlStub;
                };
                KairosDBQueryBuilder.prototype.buildTagsRequestBody = function (metricName, filters) {
                    if (filters === void 0) { filters = {}; }
                    return {
                        cache_time: 0,
                        metrics: [{ name: metricName, tags: filters }],
                        start_absolute: this.templateSrv.timeRange.from.unix() * 1000,
                        end_absolute: this.templateSrv.timeRange.to.unix() * 1000,
                    };
                };
                return KairosDBQueryBuilder;
            })();
            exports_1("KairosDBQueryBuilder", KairosDBQueryBuilder);
        }
    }
});
//# sourceMappingURL=query_builder.js.map