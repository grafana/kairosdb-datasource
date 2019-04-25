export declare class TagInputCtrl {
    private uiSegmentSrv;
    tagValues: string[];
    private $scope;
    private promiseUtils;
    /** @ngInject **/
    constructor($scope: any, $q: any, uiSegmentSrv: any);
    getTags(): Promise<string[]>;
}
export declare class TagInputLink {
    constructor(scope: any, element: any);
}
export declare function TagInputDirective(): {
    bindToController: boolean;
    controller: typeof TagInputCtrl;
    controllerAs: string;
    link: typeof TagInputLink;
    restrict: string;
    scope: {
        onChange: string;
        segment: string;
        tagValues: string;
    };
    templateUrl: string;
};
