import { MetricTags } from "../beans/request/metric_tags";
export declare class TagsSelectCtrl {
    private uiSegmentSrv;
    tagValues: string[];
    selectedValues: string[];
    segments: any[];
    tags: MetricTags;
    tagName: string;
    /** @ngInject **/
    constructor(uiSegmentSrv: any);
    onChange(): void;
    remove(segment: any): void;
    removeTag(): void;
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
        tags: string;
    };
    templateUrl: string;
};
