"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aggregator_1 = require("./aggregator");
var divide_aggregator_1 = require("./divide_aggregator");
var percentile_aggregator_1 = require("./percentile_aggregator");
var range_aggregator_1 = require("./range_aggregator");
var rate_aggregator_1 = require("./rate_aggregator");
var sampler_aggregator_1 = require("./sampler_aggregator");
var scale_aggregator_1 = require("./scale_aggregator");
var sma_aggregator_1 = require("./sma_aggregator");
var trim_aggregator_1 = require("./trim_aggregator");
exports.AGGREGATORS = [
    new range_aggregator_1.RangeAggregator("avg"),
    new range_aggregator_1.RangeAggregator("dev"),
    new range_aggregator_1.RangeAggregator("count"),
    new range_aggregator_1.RangeAggregator("first"),
    new range_aggregator_1.RangeAggregator("gaps"),
    new range_aggregator_1.RangeAggregator("last"),
    new range_aggregator_1.RangeAggregator("least_squares"),
    new range_aggregator_1.RangeAggregator("max"),
    new range_aggregator_1.RangeAggregator("min"),
    new range_aggregator_1.RangeAggregator("gaps"),
    new range_aggregator_1.RangeAggregator("merge"),
    new percentile_aggregator_1.PercentileAggregator(),
    new sma_aggregator_1.SmaAggregator(),
    new range_aggregator_1.RangeAggregator("sum"),
    new aggregator_1.Aggregator("diff"),
    new divide_aggregator_1.DivideAggregator(),
    new rate_aggregator_1.RateAggregator(),
    new sampler_aggregator_1.SamplerAggregator(),
    new scale_aggregator_1.ScaleAggregator(),
    new trim_aggregator_1.TrimAggregator()
];
var RANGE_AGGREGATORS = ["avg", "dev", "count", "first", "gaps",
    "last", "least_squares", "max", "min", "gaps", "merge", "sum"];
function fromObject(object) {
    if (object.name in RANGE_AGGREGATORS) {
        return range_aggregator_1.RangeAggregator.fromObject(object);
    }
    else if (object.name === percentile_aggregator_1.PercentileAggregator.NAME) {
        return percentile_aggregator_1.PercentileAggregator.fromObject(object);
    }
    else if (object.name === sma_aggregator_1.SmaAggregator.NAME) {
        return sma_aggregator_1.SmaAggregator.fromObject(object);
    }
    else if (object.name === divide_aggregator_1.DivideAggregator.NAME) {
        return divide_aggregator_1.DivideAggregator.fromObject(object);
    }
    else if (object.name === rate_aggregator_1.RateAggregator.NAME) {
        return rate_aggregator_1.RateAggregator.fromObject(object);
    }
    else if (object.name === sampler_aggregator_1.SamplerAggregator.NAME) {
        return sampler_aggregator_1.SamplerAggregator.fromObject(object);
    }
    else if (object.name === scale_aggregator_1.ScaleAggregator.NAME) {
        return scale_aggregator_1.ScaleAggregator.fromObject(object);
    }
    else if (object.name === trim_aggregator_1.TrimAggregator.NAME) {
        return trim_aggregator_1.TrimAggregator.fromObject(object);
    }
    else if (object.name === "diff") {
        return new aggregator_1.Aggregator("diff");
    }
    return object;
}
exports.fromObject = fromObject;
