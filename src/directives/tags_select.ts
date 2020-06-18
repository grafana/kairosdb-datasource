import _ from "lodash";

export interface SegmentLike {
    value: string | null;
    type: "plus-button";
}

export class TagsSelectCtrl {
    // All possible values
    public tagValues: string[];
    // The currently selected values
    public selectedValues: string[];

    // UI list of <all selected values> and the plus button
    public segments: SegmentLike[];

    /** @ngInject **/
    constructor(private uiSegmentSrv) {
        // The injected 'selectValues' contains a nullish value if there was a trailing [+] saved.
        this.selectedValues = (this.selectedValues || []).filter(notNil);
        this.segments = this.selectedValues.map(uiSegmentSrv.newSegment);
        this.showPlusButtonIfNeeded();
    }

    public onChange(): void {
        this.showPlusButtonIfNeeded();
        this.updateSelectedValues();
    }

    public remove(segment: SegmentLike): void {
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

    private isPlusButton(segment: SegmentLike): boolean {
        /**
         * A note on plus-button segments:
         * When you select a tag from a plus button, it mutates a "plus-button" segment from value
         * null to the value you selected; but remains of type plus-button.
         *
         * So this heuristic actually looks for the "visually, functionally" plus buttons - ones
         * that are unset.
         */
        return notNil(segment) &&
            segment.type === "plus-button" &&
            _.isNil(segment.value);
    }

}

function notNil(obj: any): boolean {
    return !_.isNil(obj);
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
