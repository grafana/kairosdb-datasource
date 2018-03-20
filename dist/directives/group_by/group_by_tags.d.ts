export declare class GroupByTagsCtrl {
    tags: string[];
    selectedTags: {
        [key: string]: boolean;
    };
    inputVisible: boolean;
    allowedValues: string[];
    constructor();
    onChange(): void;
    addCustom(tag: string): void;
}
export declare function GroupByTagsDirective(): {
    bindToController: boolean;
    controller: typeof GroupByTagsCtrl;
    controllerAs: string;
    restrict: string;
    scope: {
        allowedValues: string;
        tags: string;
    };
    templateUrl: string;
};
