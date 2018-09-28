import { Aggregator } from "../beans/aggregators/aggregator";
import { AggregatorParameter } from "../beans/aggregators/parameters/aggregator_parameter";
export declare class AggregatorCtrl {
    value: Aggregator;
    visibleParameters: AggregatorParameter[];
    isAutoValue: boolean;
    constructor();
    private getVisibleParameters();
}
export declare function AggregatorDirective(): {
    bindToController: boolean;
    controller: typeof AggregatorCtrl;
    controllerAs: string;
    restrict: string;
    scope: {
        onRemove: string;
        value: string;
    };
    templateUrl: string;
};
