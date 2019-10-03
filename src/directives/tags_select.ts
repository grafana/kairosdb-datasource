import _ from "lodash";

export class TagsSelectCtrl {
    public tagValues: string[];
    public selectedValues: string[];
    public segments: any[];

    /** @ngInject **/
    constructor(private uiSegmentSrv) {
        this.selectedValues = this.selectedValues || [];
        if (this.tagValues.length > 0) {
            this.segments = this.selectedValues
                .map((tagValue) => this.uiSegmentSrv.newSegment(tagValue));
            this.segments.push(this.uiSegmentSrv.newPlusButton());
        }
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
            tagValues: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/tags.select.html"
    };
}
