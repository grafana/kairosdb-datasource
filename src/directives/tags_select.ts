import _ from "lodash";
import { MetricTags } from "../beans/request/metric_tags";

export class TagsSelectCtrl {
    public tagValues: string[];
    public selectedValues: string[];
    public segments: any[];
    public tags: MetricTags;
    public tagName: string;

    /** @ngInject **/
    constructor(private uiSegmentSrv) {
        this.selectedValues = this.selectedValues || [];
        if (this.tagValues.length === 1 && _.isEmpty(this.selectedValues)) {
            this.selectedValues = this.tagValues;
        }
        this.segments = this.selectedValues.map((tagValue) => this.uiSegmentSrv.newSegment({value: tagValue, cssClass: "query-part"}));
        this.segments.push(this.uiSegmentSrv.newPlusButton());
    }

    public onChange(): void {
        if (!_.isNil(_.last(this.segments).value)) {
            this.segments.push(this.uiSegmentSrv.newPlusButton());
        }
        this.update();
    }

    public remove(segment): void {
        this.segments = _.without(this.segments, segment);
        this.update();
    }

    public removeTag(): void {
        delete this.tags[this.tagName];
    }

    private update(): void {
        this.selectedValues = this.segments
            .map((tagSegment) => tagSegment.value)
            .filter((value) => !_.isNil(value));
    }
}

export function TagsSelectDirective() {
    return {
        bindToController: true,
        controller: TagsSelectCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            selectedValues: "=",
            tagName: "=",
            tagValues: "=",
            tags: "=",
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/tags.select.html"
    };
}
