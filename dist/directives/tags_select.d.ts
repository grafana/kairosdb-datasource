export declare class TagsSelectCtrl {
    private uiSegmentSrv;
    tagValues: string[];
    selectedValues: string[];
    segments: any[];
    /** @ngInject **/
    constructor(uiSegmentSrv: any);
    onChange(): void;
    remove(segment: any): void;
    private update();
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
