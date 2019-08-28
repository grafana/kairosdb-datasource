import { Aggregator } from "../beans/aggregators/aggregator";
import { AggregatorParameter } from "../beans/aggregators/parameters/aggregator_parameter";
import "./aggregator_editor";
export declare class AggregatorCtrl {
    value: Aggregator;
    isFirst: boolean;
    isLast: boolean;
    visibleParameters: AggregatorParameter[];
    isAutoValue: boolean;
    constructor();
    private getVisibleParameters;
}
export declare function AggregatorDirective(): {
    bindToController: boolean;
    controller: typeof AggregatorCtrl;
    controllerAs: string;
    restrict: string;
    scope: {
        onRemove: string;
        onUp: string;
        onDown: string;
        value: string;
        isFirst: string;
        isLast: string;
    };
    templateUrl: string;
};
