import _ from "lodash";

import {AggregatorParameter} from "../../beans/aggregators/parameters/aggregator_parameter";
import {AutoValueSwitch} from "../../directives/auto_value_switch";
import {TimeUnitUtils} from "../../utils/time_unit_utils";

export class ParameterObjectBuilder {
    private autoValueEnabled: boolean;
    private autoValueDependentParameters: string[] = [];
    private autoIntervalValue: string;
    private autoIntervalUnit: string;

    constructor(interval: string, autoValueSwitch: AutoValueSwitch) {
        this.autoValueEnabled = !_.isNil(autoValueSwitch) && autoValueSwitch.enabled;
        if (this.autoValueEnabled) {
            this.autoValueDependentParameters = autoValueSwitch.dependentParameters
                .map((parameter) => parameter.type);
        }
        const relativeTime = TimeUnitUtils.convertFromInterval(interval);
        this.autoIntervalValue = relativeTime.value;
        this.autoIntervalUnit = relativeTime.unit;
    }

    public build(parameter: AggregatorParameter): any {
        switch (parameter.type) {
            case "alignment":
                return this.buildAlignmentParameter(parameter);
            case "sampling":
                return this.buildSamplingParameter(parameter, this.autoIntervalValue);
            case "sampling_unit":
                return this.buildSamplingParameter(parameter, this.autoIntervalUnit);
            default:
                return this.buildDefault(parameter);
        }
    }

    private buildAlignmentParameter(parameter: AggregatorParameter): any {
        switch (parameter.value) {
            case "NONE":
                return {};
            case "START_TIME":
                return {
                    align_start_time: true
                };
            case "SAMPLING":
                return {
                    align_sampling: true
                };
            default:
                throw new Error("Unknown alignment type");
        }
    }

    private buildSamplingParameter(parameter: AggregatorParameter, autoValue: string) {
        const parameterObject = {sampling: {}};
        parameterObject.sampling[parameter.name] =
            this.autoValueEnabled ? autoValue : parameter.value;
        return parameterObject;
    }

    private buildDefault(parameter: AggregatorParameter) {
        const parameterObject = {};
        parameterObject[parameter.name] = parameter.value;
        return parameterObject;
    }
}
