/// <reference path="node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(["angular", "./core/config_ctrl", "./core/datasource", "./core/query_ctrl", "./directives/aggregator", "./directives/aggregator_editor", "./directives/aggregators", "./directives/group_by/group_by_tags", "./directives/group_by/group_by_time", "./directives/group_by/group_by_value", "./directives/metric_name_field", "./directives/tag_input", "./directives/tags_select"], function(exports_1) {
    var angular_1, config_ctrl_1, datasource_1, query_ctrl_1, aggregator_1, aggregator_editor_1, aggregators_1, group_by_tags_1, group_by_time_1, group_by_value_1, metric_name_field_1, tag_input_1, tags_select_1;
    var KairosDBQueryOptionsCtrl;
    return {
        setters:[
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (config_ctrl_1_1) {
                config_ctrl_1 = config_ctrl_1_1;
            },
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            },
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (aggregator_editor_1_1) {
                aggregator_editor_1 = aggregator_editor_1_1;
            },
            function (aggregators_1_1) {
                aggregators_1 = aggregators_1_1;
            },
            function (group_by_tags_1_1) {
                group_by_tags_1 = group_by_tags_1_1;
            },
            function (group_by_time_1_1) {
                group_by_time_1 = group_by_time_1_1;
            },
            function (group_by_value_1_1) {
                group_by_value_1 = group_by_value_1_1;
            },
            function (metric_name_field_1_1) {
                metric_name_field_1 = metric_name_field_1_1;
            },
            function (tag_input_1_1) {
                tag_input_1 = tag_input_1_1;
            },
            function (tags_select_1_1) {
                tags_select_1 = tags_select_1_1;
            }],
        execute: function() {
            KairosDBQueryOptionsCtrl = (function () {
                function KairosDBQueryOptionsCtrl() {
                }
                KairosDBQueryOptionsCtrl.templateUrl = "partials/query.options.html";
                return KairosDBQueryOptionsCtrl;
            })();
            exports_1("Datasource", datasource_1.KairosDBDatasource);
            exports_1("QueryCtrl", query_ctrl_1.KairosDBQueryCtrl);
            exports_1("ConfigCtrl", config_ctrl_1.KairosDBConfigCtrl);
            exports_1("QueryOptionsCtrl", KairosDBQueryOptionsCtrl);
            angular_1.default.module("grafana.directives")
                .directive("aggregatorEditor", aggregator_editor_1.AggregatorEditorDirective)
                .directive("aggregator", aggregator_1.AggregatorDirective)
                .directive("aggregators", aggregators_1.AggregatorsDirective)
                .directive("metricNameField", metric_name_field_1.MetricNameFieldDirective)
                .directive("tagsSelect", tags_select_1.TagsSelectDirective)
                .directive("tagInput", tag_input_1.TagInputDirective)
                .directive("groupByValue", group_by_value_1.GroupByValueDirective)
                .directive("groupByTime", group_by_time_1.GroupByTimeDirective)
                .directive("groupByTags", group_by_tags_1.GroupByTagsDirective);
        }
    }
});
//# sourceMappingURL=module.js.map