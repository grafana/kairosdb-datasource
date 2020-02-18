import _ from "lodash";

export class TagsSelectCtrl {
    // All possible values
    public tagValues: string[];
    // The currently selected values
    public selectedValues: string[];

    // UI list of <all selected values> and the plus button
    public segments: any[];

    /** @ngInject **/
    constructor(private uiSegmentSrv) {
        this.selectedValues = this.selectedValues || [];
        this.segments = this.selectedValues.map(this.uiSegmentSrv.newSegment);
        this.showPlusButtonIfNeeded();
    }

    public onChange(): void {
        this.showPlusButtonIfNeeded();
        this.updateSelectedValues();
    }

    public remove(segment): void {
        this.segments = _.without(this.segments, segment);
        this.updateSelectedValues();
    }

    private showPlusButtonIfNeeded() {
        const lastSeg = _.last(this.segments);

        if (!this.isPlusButton(lastSeg)) {
            this.segments.push(this.uiSegmentSrv.newPlusButton());
        }
    }

    private updateSelectedValues(): void {
        this.selectedValues = this.segments
            .filter((segment) => !this.isPlusButton(segment))
            .map((tagSegment) => tagSegment.value);
    }

    private isPlusButton(segment): boolean {
        /**
         * A note on plus-button segments:
         * When you select a tag from a plus button, it mutates a "plus-button" segment from value
         * null to the value you selected; but remains of type plus-button.
         *
         * So this heuristic actually looks for the "visually, functionally" plus buttons - ones
         * that are unset.
         */
        return !_.isNil(segment) &&
            segment.type === "plus-button" &&
            _.isNil(segment.value);
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
