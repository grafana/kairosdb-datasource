import { LimitedAggregatorParameter } from "./limited_aggregator_parameter";
export declare class EnumAggregatorParameter extends LimitedAggregatorParameter {
    static fromObject(object: any): EnumAggregatorParameter;
    constructor(name: string, enumType: any, text?: string, value?: any);
}
