import { QueryCtrl } from "app/plugins/sdk";
import { Aggregator } from "../beans/aggregators/aggregator";
import "../css/plugin.css!";
import "../directives/aggregators";
import "../directives/group_by/group_by_tags";
import "../directives/group_by/group_by_time";
import "../directives/group_by/group_by_value";
import "../directives/metric_name_field";
import "../directives/tags_select";
export declare class KairosDBQueryCtrl extends QueryCtrl {
    static templateUrl: string;
    aggregators: Aggregator[];
    tagsInitializationError: string;
    private targetValidator;
    private tags;
    private legacyTargetConverter;
    constructor($scope: any, $injector: any);
    getCollapsedText(): string;
    private onTargetChange;
    private onMetricNameChanged;
    private buildNewTarget;
    private initializeTags;
    private isTargetChanged;
    private clear;
}
