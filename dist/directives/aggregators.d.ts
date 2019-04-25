import { Aggregator } from "../beans/aggregators/aggregator";
export declare class AggregatorsCtrl {
    entries: Aggregator[];
    availableAggregators: Aggregator[];
    add(entry: any): void;
    remove(entry: any): void;
}
export declare function AggregatorsDirective(): {
    bindToController: boolean;
    controller: typeof AggregatorsCtrl;
    controllerAs: string;
    restrict: string;
    scope: {
        availableAggregators: string;
        entries: string;
    };
    templateUrl: string;
};
