import { AggregatorParameter } from "../../beans/aggregators/parameters/aggregator_parameter";
import { UnitValue } from "../../beans/aggregators/utils";
import { AutoValueSwitch } from "../../directives/auto_value_switch";
export declare class ParameterObjectBuilder {
    private autoValueEnabled;
    private autoValueDependentParameters;
    private autoIntervalValue;
    private autoIntervalUnit;
    constructor(interval: string, autoValueSwitch: AutoValueSwitch, snapToIntervals?: UnitValue[]);
    build(parameter: AggregatorParameter): any;
    private buildAlignmentParameter;
    private buildSamplingParameter;
    private buildDefault;
    private isOverriddenByAutoValue;
}
