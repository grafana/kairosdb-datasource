import { AggregatorParameter } from "../beans/aggregators/parameters/aggregator_parameter";
export declare class AutoValueSwitch {
    static fromObject(object: any, dependentParameters: AggregatorParameter[]): AutoValueSwitch;
    dependentParameters: AggregatorParameter[];
    enabled: boolean;
    constructor(dependentParameters: AggregatorParameter[]);
}
