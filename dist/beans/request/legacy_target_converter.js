System.register(["lodash", "../../directives/group_by/group_by_time_entry", "../../utils/time_unit_utils", "../aggregators/aggregator", "../aggregators/divide_aggregator", "../aggregators/percentile_aggregator", "../aggregators/range_aggregator", "../aggregators/rate_aggregator", "../aggregators/sampler_aggregator", "../aggregators/scale_aggregator", "../aggregators/trim_aggregator", "./target"], function(exports_1) {
    var lodash_1, group_by_time_entry_1, time_unit_utils_1, aggregator_1, divide_aggregator_1, percentile_aggregator_1, range_aggregator_1, rate_aggregator_1, sampler_aggregator_1, scale_aggregator_1, trim_aggregator_1, target_1;
    var LegacyTargetConverter;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (group_by_time_entry_1_1) {
                group_by_time_entry_1 = group_by_time_entry_1_1;
            },
            function (time_unit_utils_1_1) {
                time_unit_utils_1 = time_unit_utils_1_1;
            },
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (divide_aggregator_1_1) {
                divide_aggregator_1 = divide_aggregator_1_1;
            },
            function (percentile_aggregator_1_1) {
                percentile_aggregator_1 = percentile_aggregator_1_1;
            },
            function (range_aggregator_1_1) {
                range_aggregator_1 = range_aggregator_1_1;
            },
            function (rate_aggregator_1_1) {
                rate_aggregator_1 = rate_aggregator_1_1;
            },
            function (sampler_aggregator_1_1) {
                sampler_aggregator_1 = sampler_aggregator_1_1;
            },
            function (scale_aggregator_1_1) {
                scale_aggregator_1 = scale_aggregator_1_1;
            },
            function (trim_aggregator_1_1) {
                trim_aggregator_1 = trim_aggregator_1_1;
            },
            function (target_1_1) {
                target_1 = target_1_1;
            }],
        execute: function() {
            LegacyTargetConverter = (function () {
                function LegacyTargetConverter() {
                }
                LegacyTargetConverter.prototype.convert = function (oldTarget) {
                    var _this = this;
                    var newTarget = new target_1.KairosDBTarget();
                    newTarget.tags = oldTarget.tags;
                    newTarget.metricName = oldTarget.metric;
                    newTarget.groupBy.tags = oldTarget.groupByTags || [];
                    newTarget.alias = oldTarget.aliasMode === "default" ? undefined : oldTarget.alias;
                    if (!lodash_1.default.isNil(oldTarget.nonTagGroupBys)) {
                        var nonTagGroupBys = lodash_1.default.groupBy(oldTarget.nonTagGroupBys, function (groupByEntry) { return groupByEntry.name; });
                        if (lodash_1.default.has(nonTagGroupBys, "time")) {
                            newTarget.groupBy.time = nonTagGroupBys.time.map(function (entry) { return _this.mapGroupByTime(entry); });
                        }
                        if (lodash_1.default.has(nonTagGroupBys, "value")) {
                            newTarget.groupBy.value = nonTagGroupBys.value.map(function (entry) { return _this.mapGroupByValue(entry); });
                        }
                    }
                    if (!lodash_1.default.isNil(oldTarget.horizontalAggregators)) {
                        newTarget.aggregators = oldTarget.horizontalAggregators.map(function (entry) { return _this.convertLegacyAggregator(entry); });
                    }
                    return newTarget;
                };
                LegacyTargetConverter.prototype.isApplicable = function (target) {
                    return lodash_1.default.isNil(target.query) && !lodash_1.default.isNil(target.horAggregator);
                };
                LegacyTargetConverter.prototype.mapGroupByTime = function (groupBy) {
                    var intervalValue = time_unit_utils_1.TimeUnitUtils.extractValue(groupBy.range_size);
                    var unit = time_unit_utils_1.TimeUnitUtils.convertTimeUnit(groupBy.range_size.replace(intervalValue, ""));
                    return new group_by_time_entry_1.GroupByTimeEntry(intervalValue, unit, groupBy.group_count);
                };
                LegacyTargetConverter.prototype.mapGroupByValue = function (groupBy) {
                    return groupBy.range_size;
                };
                LegacyTargetConverter.prototype.convertLegacyRangeAggregator = function (horizontalAggregator) {
                    if (horizontalAggregator.sampling_rate === "auto") {
                        var rangeAgg = new range_aggregator_1.RangeAggregator(horizontalAggregator.name);
                        rangeAgg.autoValueSwitch.enabled = true;
                        return rangeAgg;
                    }
                    else {
                        var rangeAgg = new range_aggregator_1.RangeAggregator(horizontalAggregator.name);
                        rangeAgg.parameters[this.findParameterIndex(rangeAgg, "value")].value = horizontalAggregator.sampling_rate;
                        return rangeAgg;
                    }
                };
                LegacyTargetConverter.prototype.convertLegacyPercentileAggregator = function (horizontalAggregator) {
                    if (horizontalAggregator.percentile.sampling_rate === "auto") {
                        var percentileAgg = new percentile_aggregator_1.PercentileAggregator();
                        percentileAgg.autoValueSwitch.enabled = true;
                        percentileAgg.parameters[this.findParameterIndex(percentileAgg, "percentile")].value =
                            horizontalAggregator.percentile;
                        return percentileAgg;
                    }
                    else {
                        var percentileAgg = new percentile_aggregator_1.PercentileAggregator();
                        percentileAgg.parameters[this.findParameterIndex(percentileAgg, "value")].value =
                            horizontalAggregator.sampling_rate;
                        percentileAgg.parameters[this.findParameterIndex(percentileAgg, "percentile")].value =
                            horizontalAggregator.percentile;
                        return percentileAgg;
                    }
                };
                LegacyTargetConverter.prototype.convertLegacyAggregator = function (horizontalAggregator) {
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
                        case "percentile":
                            return this.convertLegacyPercentileAggregator(horizontalAggregator);
                        case "diff":
                            return new aggregator_1.Aggregator("diff");
                        case "div":
                            var divAgg = new divide_aggregator_1.DivideAggregator();
                            divAgg.parameters[this.findParameterIndex(divAgg, "divisor")].value = horizontalAggregator.factor;
                            return divAgg;
                        case "rate":
                            var rateAgg = new rate_aggregator_1.RateAggregator();
                            rateAgg.parameters[this.findParameterIndex(rateAgg, "unit")].value =
                                time_unit_utils_1.TimeUnitUtils.convertTimeUnit(horizontalAggregator.unit);
                            return rateAgg;
                        case "sampler":
                            var samplerAgg = new sampler_aggregator_1.SamplerAggregator();
                            samplerAgg.parameters[this.findParameterIndex(samplerAgg, "unit")].value =
                                time_unit_utils_1.TimeUnitUtils.convertTimeUnit(horizontalAggregator.unit);
                            return samplerAgg;
                        case "scale":
                            var scaleAgg = new scale_aggregator_1.ScaleAggregator();
                            scaleAgg.parameters[this.findParameterIndex(scaleAgg, "factor")].value = horizontalAggregator.factor;
                            return scaleAgg;
                        case "trim":
                            return new trim_aggregator_1.TrimAggregator();
                        default:
                            throw new Error("Unknown aggregator type " + horizontalAggregator.name);
                    }
                };
                LegacyTargetConverter.prototype.findParameterIndex = function (aggregator, parameterName) {
                    return lodash_1.default.findIndex(aggregator.parameters, function (parameter) { return parameter.name === parameterName; });
                };
                return LegacyTargetConverter;
            })();
            exports_1("LegacyTargetConverter", LegacyTargetConverter);
        }
    }
});
//# sourceMappingURL=legacy_target_converter.js.map