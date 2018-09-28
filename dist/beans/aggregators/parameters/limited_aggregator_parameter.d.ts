import { AggregatorParameter } from "./aggregator_parameter";
export declare class LimitedAggregatorParameter extends AggregatorParameter {
    private allowedValues;
    constructor(name: string, allowedValues: any[], text?: string, value?: any);
}
