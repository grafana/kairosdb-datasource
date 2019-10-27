import { Aggregator } from "../beans/aggregators/aggregator";
import { AggregatorParameter } from "../beans/aggregators/parameters/aggregator_parameter";
export declare class AggregatorCtrl {
    value: Aggregator;
    isAutoValue: boolean;
    constructor();
    getVisibleParameters(): AggregatorParameter[];
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
