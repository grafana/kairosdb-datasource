import _ from "lodash";
import {Aggregator} from "../../beans/aggregators/aggregator";
import {AggregatorParameter} from "../../beans/aggregators/parameters/aggregator_parameter";
import {SamplingAggregatorParameter} from "../../beans/aggregators/parameters/sampling_aggregator_parameter";
import {SamplingUnitAggregatorParameter} from "../../beans/aggregators/parameters/sampling_unit_aggregator_parameter";
import {SamplingConverter} from "./sampling_converter";

export class SamplingParameterConverter {
    private samplingConverter: SamplingConverter;

    constructor(samplingConverter: SamplingConverter) {
        this.samplingConverter = samplingConverter;
    }

    public convertSamplingParameters(aggregator: Aggregator) {
        const parameters = aggregator.parameters;
        const samplingParameterIndex = this.findParameterIndex(parameters, SamplingAggregatorParameter.TYPE);
        const samplingUnitParameterIndex = this.findParameterIndex(parameters, SamplingUnitAggregatorParameter.TYPE);

        if (samplingParameterIndex > -1 && samplingUnitParameterIndex > -1) {
            const samplingParameter = parameters[samplingParameterIndex];
            const samplingUnitParameter = parameters[samplingUnitParameterIndex];
            if (this.samplingConverter.isApplicable(samplingParameter.value)) {
                const convertedSampling =
                    this.samplingConverter.convert(samplingParameter.value, samplingUnitParameter.value);
                samplingParameter.value = convertedSampling.interval;
                samplingUnitParameter.value = convertedSampling.unit;
            }
        }
        return aggregator;
    }

    private findParameterIndex(parameters: AggregatorParameter[], type: string): number {
        return _.findIndex(parameters, (parameter) => parameter.type === type);
    }
}
