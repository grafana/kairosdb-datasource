import {Aggregator} from "./aggregator";
import {DivideAggregator} from "./divide_aggregator";
import {PercentileAggregator} from "./percentile_aggregator";
import {RangeAggregator} from "./range_aggregator";
import {RateAggregator} from "./rate_aggregator";
import {SamplerAggregator} from "./sampler_aggregator";
import {ScaleAggregator} from "./scale_aggregator";
import {SmaAggregator} from "./sma_aggregator";
import {TrimAggregator} from "./trim_aggregator";

export const AGGREGATORS = [
    new RangeAggregator("avg"),
    new RangeAggregator("dev"),
    new RangeAggregator("count"),
    new Aggregator("diff"),
    new DivideAggregator(),
    new RangeAggregator("first"),
    new RangeAggregator("gaps"),
    new RangeAggregator("last"),
    new RangeAggregator("least_squares"),
    new RangeAggregator("max"),
    new RangeAggregator("min"),
    new PercentileAggregator(),
    new RateAggregator(),
    new SamplerAggregator(),
    new ScaleAggregator(),
    new SmaAggregator(),
    new RangeAggregator("sum"),
    new TrimAggregator()
];
