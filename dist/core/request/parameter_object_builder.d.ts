import { AggregatorParameter } from "../../beans/aggregators/parameters/aggregator_parameter";
import { AutoValueSwitch } from "../../directives/auto_value_switch";
export declare class ParameterObjectBuilder {
    private autoValueEnabled;
    private autoValueDependentParameters;
    private autoIntervalValue;
    private autoIntervalUnit;
    constructor(interval: string, autoValueSwitch: AutoValueSwitch);
    build(parameter: AggregatorParameter): any;
    private buildAlignmentParameter(parameter);
    private buildSamplingParameter(parameter, autoValue);
    private buildDefault(parameter);
}
