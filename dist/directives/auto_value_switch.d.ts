import { AggregatorParameter } from "../beans/aggregators/parameters/aggregator_parameter";
export declare class AutoValueSwitch {
    dependentParameters: AggregatorParameter[];
    enabled: boolean;
    constructor(dependentParameters: AggregatorParameter[]);
}
