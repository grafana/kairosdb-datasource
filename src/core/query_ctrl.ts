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
        if (this.target.query && !(this.target.query instanceof KairosDBTarget)) {
            this.target.query = KairosDBTarget.fromObject(this.target.query);
        } else {
            this.target.query = this.target.query || new KairosDBTarget();
        }
        this.initializeTags(this.target.query.metricName, this.target.query);
    }

    public getCollapsedText(): string {
        return this.target.query.asString();
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
        const query = this.buildNewTarget(newMetricName);
        this.initializeTags(newMetricName, query);
        this.target.query = query;
    }

    private buildNewTarget(metricName) {
        const oldQuery: KairosDBTarget | undefined = this.target.query;
        const target = new KairosDBTarget();
        target.metricName = metricName;
        if (oldQuery) {
          target.aggregators = oldQuery.aggregators;
          target.alias = oldQuery.alias;
          target.tags = oldQuery.tags;
          target.groupBy = oldQuery.groupBy;
          target.timeRange = oldQuery.timeRange;
        }
        return target;
    }

    private initializeTags(metricName: string, query: KairosDBTarget) {
        this.clear();
        if (metricName) {
            this.tags = new MetricTags();
            this.datasource.getMetricTags(metricName)
                .then(
                    (tags) => this.tags.updateTags(tags),
                    (error) => this.tagsInitializationError = error.data.message
                )
                .then(
                  () => {
                    if (!this.tagsInitializationError) {
                      const newTags: {[key: string]: string[]} = {};
                      Object.keys(query.tags)
                        .filter((tag) => this.tags.tags.hasOwnProperty(tag))
                        .forEach((tag) => {
                          newTags[tag] = query.tags[tag]
                            .filter((value) => this.tags.tags[tag].indexOf(value) > -1
                              || value.charAt(0) === "$"
                              || (value.charAt(0) === "[" && value.charAt(value.length - 1) === "]"));
                        });
                      Object.keys(this.tags.tags)
                        .filter((tag) => !query.tags.hasOwnProperty(tag))
                        .forEach((tag) => newTags[tag] = []);
                      query.tags = newTags;
                      if (query.groupBy.tags) {
                        query.groupBy.tags = query.groupBy.tags.filter((tag) => this.tags.tags.hasOwnProperty(tag));
                      }
                    }
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
}
