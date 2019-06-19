import { QueryCtrl } from "app/plugins/sdk";
import { Aggregator } from "../beans/aggregators/aggregator";
export declare class KairosDBQueryCtrl extends QueryCtrl {
    static templateUrl: string;
    aggregators: Aggregator[];
    tagsInitializationError: string;
    customTagName: string;
    private targetValidator;
    private tags;
    private legacyTargetConverter;
    /** @ngInject **/
    constructor($scope: any, $injector: any);
    private onTargetChange(newTarget, oldTarget);
    private onMetricNameChanged(newMetricName, oldMetricName);
    private onTagsChange(newTags, oldTags);
    private buildNewTarget(metricName);
    private initializeTags(metricName);
    private isTargetChanged(newTarget, oldTarget);
    private clear();
    private addCustomTag();
}
