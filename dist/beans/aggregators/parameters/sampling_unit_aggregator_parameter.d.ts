import { AggregatorParameterType } from "./aggregator_parameter";
import { EnumAggregatorParameter } from "./enum_aggregator_parameter";
export declare class SamplingUnitAggregatorParameter extends EnumAggregatorParameter {
    static TYPE: AggregatorParameterType;
    static fromObject(object: any): SamplingUnitAggregatorParameter;
    constructor();
}
