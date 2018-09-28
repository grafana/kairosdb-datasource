/// <reference path="node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import angular from "angular";

import {KairosDBConfigCtrl} from "./core/config_ctrl";
import {KairosDBDatasource} from "./core/datasource";
import {KairosDBQueryCtrl} from "./core/query_ctrl";
import {AggregatorDirective} from "./directives/aggregator";
import {AggregatorEditorDirective} from "./directives/aggregator_editor";
import {AggregatorsDirective} from "./directives/aggregators";
import {GroupByTagsDirective} from "./directives/group_by/group_by_tags";
import {GroupByTimeDirective} from "./directives/group_by/group_by_time";
import {GroupByValueDirective} from "./directives/group_by/group_by_value";
import {MetricNameFieldDirective} from "./directives/metric_name_field";
import {TagInputDirective} from "./directives/tag_input";
import {TagsSelectDirective} from "./directives/tags_select";

class KairosDBQueryOptionsCtrl {
    public static templateUrl = "partials/query.options.html";
}

export {
    KairosDBDatasource as Datasource,
    KairosDBQueryCtrl as QueryCtrl,
    KairosDBConfigCtrl as ConfigCtrl,
    KairosDBQueryOptionsCtrl as QueryOptionsCtrl
};

angular.module("grafana.directives")
    .directive("aggregatorEditor", AggregatorEditorDirective)
    .directive("aggregator", AggregatorDirective)
    .directive("aggregators", AggregatorsDirective)
    .directive("metricNameField", MetricNameFieldDirective)
    .directive("tagsSelect", TagsSelectDirective)
    .directive("tagInput", TagInputDirective)
    .directive("groupByValue", GroupByValueDirective)
    .directive("groupByTime", GroupByTimeDirective)
    .directive("groupByTags", GroupByTagsDirective);
