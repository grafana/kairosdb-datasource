import {QueryCtrl} from "app/plugins/sdk";
import {Aggregator} from "../beans/aggregators/aggregator";
import {AGGREGATORS} from "../beans/aggregators/aggregators";
import {LegacyTargetConverter} from "../beans/request/legacy_target_converter";
import {MetricTags} from "../beans/request/metric_tags";
import {KairosDBTarget} from "../beans/request/target";
import "../css/plugin.css!";
import "../directives/aggregators";
import "../directives/group_by/group_by_tags";
import "../directives/group_by/group_by_time";
import "../directives/group_by/group_by_value";
import "../directives/metric_name_field";
import "../directives/tags_select";
import {TargetValidator} from "./request/target_validator";

export class KairosDBQueryCtrl extends QueryCtrl {
    public static templateUrl = "partials/query.editor.html";

    public aggregators: Aggregator[] = AGGREGATORS;
    public tagsInitializationError: string = undefined;
    public customTagName: string = "";
    private targetValidator: TargetValidator = new TargetValidator();
    private tags: MetricTags;
    private legacyTargetConverter: LegacyTargetConverter = new LegacyTargetConverter();

    /** @ngInject **/
    constructor($scope, $injector) {
        super($scope, $injector);
        this.datasource.initialize();
        $scope.$watch("ctrl.target.query", this.onTargetChange.bind(this), true);
        $scope.$watch("ctrl.tags.tags", this.onTagsChange.bind(this), true);
        $scope.$watch("ctrl.target.query.metricName", this.onMetricNameChanged.bind(this));
        if (this.legacyTargetConverter.isApplicable(this.target)) {
            this.target.query = this.legacyTargetConverter.convert(this.target);
        }
        this.target.query = this.target.query || new KairosDBTarget();
        this.initializeTags(this.target.query.metricName);
    }

    private onTargetChange(newTarget, oldTarget) {
        if (this.isTargetChanged(newTarget, oldTarget) && this.targetValidator.isValidTarget(newTarget)) {
            this.refresh();
        }
    }

    private onMetricNameChanged(newMetricName, oldMetricName) {
        if (newMetricName === oldMetricName) {
            return;
        }
        this.target.query = this.buildNewTarget(newMetricName);
        this.initializeTags(newMetricName);
    }

    private onTagsChange(newTags, oldTags) {
        this.tags.updateTags(newTags);
    }

    private buildNewTarget(metricName) {
        const target = new KairosDBTarget();
        target.metricName = metricName;
        return target;
    }

    private initializeTags(metricName: string) {
        this.clear();
        this.tags = new MetricTags();
        if (metricName) {
            this.datasource.getMetricTags(metricName)
                .then(
                    (tags) => {
                        Object.keys(this.target.query.tags || {}).map((key) => {
                            tags[key] = tags[key] || [];
                        });
                        this.tags.updateTags(tags);
                    },
                    (error) => {
                        if (error && error.data && error.data.message) {
                            this.tagsInitializationError = error.data.message;
                        } else if (error.cancelled) {
                            this.tagsInitializationError = "Query was cancelled";
                        } else {
                            this.tagsInitializationError = "Unknown error";
                        }

                        this.tags.updateTags(this.target.query.tags);
                    }
                );
        }
    }

    private isTargetChanged(newTarget, oldTarget) {
        return JSON.stringify(newTarget) !== JSON.stringify(oldTarget);
    }

    private clear(): void {
        this.tagsInitializationError = undefined;
    }

    private addCustomTag(): void {
        const tags = this.tags.tags;
        if (this.customTagName && !tags[this.customTagName]) {
            tags[this.customTagName] = [];
            this.tags.updateTags(tags);
        }
        this.customTagName = "";
    }
}
