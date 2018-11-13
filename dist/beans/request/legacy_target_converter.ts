import _ from "lodash";
import {GroupByTimeEntry} from "../../directives/group_by/group_by_time_entry";
import {TimeUnitUtils} from "../../utils/time_unit_utils";
import {Aggregator} from "../aggregators/aggregator";
import {DivideAggregator} from "../aggregators/divide_aggregator";
import {PercentileAggregator} from "../aggregators/percentile_aggregator";
import {RangeAggregator} from "../aggregators/range_aggregator";
import {RateAggregator} from "../aggregators/rate_aggregator";
import {SamplerAggregator} from "../aggregators/sampler_aggregator";
import {ScaleAggregator} from "../aggregators/scale_aggregator";
import {TrimAggregator} from "../aggregators/trim_aggregator";
import {KairosDBTarget} from "./target";

export class LegacyTargetConverter {
    public convert(oldTarget): KairosDBTarget {
        const newTarget = new KairosDBTarget();

        newTarget.tags = oldTarget.tags;
        newTarget.metricName = oldTarget.metric;
        newTarget.groupBy.tags = oldTarget.groupByTags || [];
        newTarget.alias = oldTarget.aliasMode === "default" ? undefined : oldTarget.alias;
        if (!_.isNil(oldTarget.nonTagGroupBys)) {
            const nonTagGroupBys = _.groupBy(oldTarget.nonTagGroupBys, (groupByEntry) => groupByEntry.name);
            if (_.has(nonTagGroupBys, "time")) {
                newTarget.groupBy.time = nonTagGroupBys.time.map((entry) => this.mapGroupByTime(entry));
            }
            if (_.has(nonTagGroupBys, "value")) {
                newTarget.groupBy.value = nonTagGroupBys.value.map((entry) => this.mapGroupByValue(entry));
            }
        }
        if (!_.isNil(oldTarget.horizontalAggregators)) {
            newTarget.aggregators = oldTarget.horizontalAggregators.map((entry) => this.convertLegacyAggregator(entry));
        }
        return newTarget;
    }

    public isApplicable(target): boolean {
        return _.isNil(target.query) && !_.isNil(target.horAggregator);
    }

    private mapGroupByTime(groupBy): GroupByTimeEntry {
        const intervalValue = TimeUnitUtils.extractValue(groupBy.range_size);
        const unit = TimeUnitUtils.convertTimeUnit(groupBy.range_size.replace(intervalValue, ""));
        return new GroupByTimeEntry(intervalValue, unit, groupBy.group_count);
    }

    private mapGroupByValue(groupBy) {
        return groupBy.range_size;
    }

    private convertLegacyRangeAggregator(horizontalAggregator): RangeAggregator {
        if (horizontalAggregator.sampling_rate === "auto") {
            const rangeAgg = new RangeAggregator(horizontalAggregator.name);
            rangeAgg.autoValueSwitch.enabled = true;
            return rangeAgg;
        } else {
            const rangeAgg = new RangeAggregator(horizontalAggregator.name);
            rangeAgg.parameters[this.findParameterIndex(rangeAgg, "value")].value = horizontalAggregator.sampling_rate;
            return rangeAgg;
        }
    }

    private convertLegacyPercentileAggregator(horizontalAggregator): PercentileAggregator {
        if (horizontalAggregator.percentile.sampling_rate === "auto") {
            const percentileAgg = new PercentileAggregator();
            percentileAgg.autoValueSwitch.enabled = true;
            percentileAgg.parameters[this.findParameterIndex(percentileAgg, "percentile")].value =
                horizontalAggregator.percentile;
            return percentileAgg;
        } else {
            const percentileAgg = new PercentileAggregator();
            percentileAgg.parameters[this.findParameterIndex(percentileAgg, "value")].value =
                horizontalAggregator.sampling_rate;
            percentileAgg.parameters[this.findParameterIndex(percentileAgg, "percentile")].value =
                horizontalAggregator.percentile;
            return percentileAgg;
        }
    }

    private convertLegacyAggregator(horizontalAggregator): Aggregator {
        switch (horizontalAggregator.name) {
            case "avg":
            case "dev":
            case "max":
            case "min":
            case "count":
            case "sum":
            case "least_squares":
            case "first":
            case "gaps":
            case "last":
                return this.convertLegacyRangeAggregator(horizontalAggregator);
            case "percentile" :
                return this.convertLegacyPercentileAggregator(horizontalAggregator);
            case "diff":
                return new Aggregator("diff");
            case "div":
                const divAgg = new DivideAggregator();
                divAgg.parameters[this.findParameterIndex(divAgg, "divisor")].value = horizontalAggregator.factor;
                return divAgg;
            case "rate":
                const rateAgg = new RateAggregator();
                rateAgg.parameters[this.findParameterIndex(rateAgg, "unit")].value =
                    TimeUnitUtils.convertTimeUnit(horizontalAggregator.unit);
                return rateAgg;
            case "sampler":
                const samplerAgg = new SamplerAggregator();
                samplerAgg.parameters[this.findParameterIndex(samplerAgg, "unit")].value =
                    TimeUnitUtils.convertTimeUnit(horizontalAggregator.unit);
                return samplerAgg;
            case "scale":
                const scaleAgg = new ScaleAggregator();
                scaleAgg.parameters[this.findParameterIndex(scaleAgg, "factor")].value = horizontalAggregator.factor;
                return scaleAgg;
            case "trim":
                return new TrimAggregator();
            default:
                throw new Error("Unknown aggregator type " + horizontalAggregator.name);
        }
    }

    private findParameterIndex(aggregator, parameterName): number {
        return _.findIndex(aggregator.parameters, (parameter) => parameter.name === parameterName);
    }
}
