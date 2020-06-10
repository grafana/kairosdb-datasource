import { AggregatorParameterType } from "./aggregator_parameter";
import { AnyAggregatorParameter } from "./any_aggregator_parameter";
export declare class SamplingAggregatorParameter extends AnyAggregatorParameter {
    static TYPE: AggregatorParameterType;
    static fromObject(object: any): SamplingAggregatorParameter;
    constructor(text?: string, value?: any);
}
