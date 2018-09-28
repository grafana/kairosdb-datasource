export declare class MetricNameFieldCtrl {
    private uiSegmentSrv;
    value: string;
    metricNames: string[];
    alias: string;
    segment: any;
    aliasInputVisible: boolean;
    aliasAddedVisible: boolean;
    private $q;
    private $scope;
    private promiseUtils;
    /** @ngInject **/
    constructor($scope: any, $q: any, uiSegmentSrv: any);
    onChange(segment: any): void;
    suggestMetrics(): string[];
    setAlias(alias: any): void;
}
export declare class MetricNameFieldLink {
    constructor(scope: any, element: any);
}
export declare function MetricNameFieldDirective(): {
    bindToController: boolean;
    controller: typeof MetricNameFieldCtrl;
    controllerAs: string;
    link: typeof MetricNameFieldLink;
    restrict: string;
    scope: {
        alias: string;
        metricNames: string;
        value: string;
    };
    templateUrl: string;
};
