import _ from "lodash";
import {TemplatingUtils} from "../../utils/templating_utils";
import {SamplingConverter} from "./sampling_converter";

export class GroupBysBuilder {
    private templatingUtils: TemplatingUtils;
    private samplingConverter: SamplingConverter;

    constructor(templatingUtils: TemplatingUtils, samplingConverter: SamplingConverter) {
        this.templatingUtils = templatingUtils;
        this.samplingConverter = samplingConverter;
    }

    public build(groupBysDefinition): any[] {
        const groupByTags = [];
        if (!_.isEmpty(groupBysDefinition.tags)) {
            groupByTags.push({name: "tag", tags: this.templatingUtils.replaceAll(groupBysDefinition.tags)});
        }

        const groupByTime = groupBysDefinition.time.map((entry) => {
            return {
                group_count: entry.count,
                name: "time",
                range_size: this.buildRangeSize(
                    this.samplingConverter.isApplicable(entry.interval) ?
                        this.samplingConverter.convert(entry.interval, entry.unit) : entry)
            };
        });

        const groupByValue = groupBysDefinition.value.map((entry) => {
            return {
                name: "value",
                range_size: entry
            };
        });

        return _.concat(groupByTags, groupByTime, groupByValue);
    }

    private buildRangeSize(parameters) {
        return {
            unit: parameters.unit,
            value: parameters.interval
        };
    }
}
