import { AnyAggregatorParameter } from "./any_aggregator_parameter";
export declare class SamplingAggregatorParameter extends AnyAggregatorParameter {
    static TYPE: string;
    static fromObject(object: any): SamplingAggregatorParameter;
    constructor(text?: string, value?: any);
}
