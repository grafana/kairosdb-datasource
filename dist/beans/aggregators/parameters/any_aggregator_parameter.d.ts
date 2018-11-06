import { AggregatorParameter } from "./aggregator_parameter";
export declare class AnyAggregatorParameter extends AggregatorParameter {
    static fromObject(object: any): AggregatorParameter;
    constructor(name: string, text?: string, value?: any);
}
