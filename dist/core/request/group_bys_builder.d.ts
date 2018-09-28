import { TemplatingUtils } from "../../utils/templating_utils";
import { SamplingConverter } from "./sampling_converter";
export declare class GroupBysBuilder {
    private templatingUtils;
    private samplingConverter;
    constructor(templatingUtils: TemplatingUtils, samplingConverter: SamplingConverter);
    build(groupBysDefinition: any): any[];
    private buildRangeSize(parameters);
}
