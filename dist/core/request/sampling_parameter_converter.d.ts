import { Aggregator } from "../../beans/aggregators/aggregator";
import { SamplingConverter } from "./sampling_converter";
export declare class SamplingParameterConverter {
    private samplingConverter;
    constructor(samplingConverter: SamplingConverter);
    convertSamplingParameters(aggregator: Aggregator): Aggregator;
    private findParameterIndex(parameters, type);
}
