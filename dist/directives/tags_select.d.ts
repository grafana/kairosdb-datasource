export interface SegmentLike {
    value: string | null;
    type: "plus-button";
}
export declare class TagsSelectCtrl {
    private uiSegmentSrv;
    tagValues: string[];
    selectedValues: string[];
    segments: SegmentLike[];
    constructor(uiSegmentSrv: any);
    onChange(): void;
    remove(segment: SegmentLike): void;
    private showPlusButtonIfNeeded;
    private updateSelectedValues;
    private isPlusButton;
}
export declare function TagsSelectDirective(): {
    bindToController: boolean;
    controller: typeof TagsSelectCtrl;
    controllerAs: string;
    restrict: string;
    scope: {
        selectedValues: string;
        tagName: string;
        tagValues: string;
    };
    templateUrl: string;
};
