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
    private targetValidator: TargetValidator = new TargetValidator();
    private tags: MetricTags;
    private legacyTargetConverter: LegacyTargetConverter = new LegacyTargetConverter();

    /** @ngInject **/
    constructor($scope, $injector) {
        super($scope, $injector);
        this.datasource.initialize();
        $scope.$watch("ctrl.target.query", this.onTargetChange.bind(this), true);
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

    private buildNewTarget(metricName) {
        const target = new KairosDBTarget();
        target.metricName = metricName;
        return target;
    }

    private initializeTags(metricName: string) {
        this.clear();
        if (metricName) {
            this.tags = new MetricTags();
            this.datasource.getMetricTags(metricName)
                .then(
                    (tags) => this.tags.updateTags(tags),
                    (error) => this.tagsInitializationError = error.data.message
                );
        }
    }

    private isTargetChanged(newTarget, oldTarget) {
        return JSON.stringify(newTarget) !== JSON.stringify(oldTarget);
    }

    private clear(): void {
        this.tagsInitializationError = undefined;
    }
}
