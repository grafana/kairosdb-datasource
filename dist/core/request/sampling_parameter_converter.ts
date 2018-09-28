import _ from "lodash";
import {Aggregator} from "../../beans/aggregators/aggregator";
import {AggregatorParameter} from "../../beans/aggregators/parameters/aggregator_parameter";
import {SamplingAggregatorParameter} from "../../beans/aggregators/parameters/sampling_aggregator_parameter";
import {SamplingUnitAggregatorParameter} from "../../beans/aggregators/parameters/sampling_unit_aggregator_parameter";
import {TimeUnitUtils} from "../../utils/time_unit_utils";
import {SamplingConverter} from "./sampling_converter";

export class SamplingParameterConverter {
    private samplingConverter: SamplingConverter;

    constructor(samplingConverter: SamplingConverter) {
        this.samplingConverter = samplingConverter;
    }

    public convertSamplingParameters(aggregator: Aggregator) {
        const parameters = aggregator.parameters;
        const samplingParameterIndex = this.findParameterIndex(parameters, SamplingAggregatorParameter.TYPE);

        if (samplingParameterIndex > -1) {
            const samplingParameter = parameters[samplingParameterIndex];
            const relativeTime = TimeUnitUtils.convertFromInterval(samplingParameter.value);
            const samplingUnitAggregatorParameter = new SamplingUnitAggregatorParameter();
            if (this.samplingConverter.isApplicable(relativeTime.value)) {
                const convertedSampling =
                    this.samplingConverter.convert(relativeTime.value, relativeTime.unit);
                samplingParameter.value = convertedSampling.interval;
                samplingUnitAggregatorParameter.value = convertedSampling.unit;
            } else {
                samplingParameter.value = relativeTime.value;
                samplingUnitAggregatorParameter.value = relativeTime.unit;
            }
            parameters.push(samplingUnitAggregatorParameter);
        }
        return aggregator;
    }

    private findParameterIndex(parameters: AggregatorParameter[], type: string): number {
        return _.findIndex(parameters, (parameter) => parameter.type === type);
    }
}
