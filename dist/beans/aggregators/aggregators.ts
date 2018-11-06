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
    new RangeAggregator("first"),
    new RangeAggregator("gaps"),
    new RangeAggregator("last"),
    new RangeAggregator("least_squares"),
    new RangeAggregator("max"),
    new RangeAggregator("min"),
    new RangeAggregator("gaps"),
    new RangeAggregator("merge"),
    new PercentileAggregator(),
    new SmaAggregator(),
    new RangeAggregator("sum"),
    new Aggregator("diff"),
    new DivideAggregator(),
    new RateAggregator(),
    new SamplerAggregator(),
    new ScaleAggregator(),
    new TrimAggregator()
];

const RANGE_AGGREGATORS = ["avg", "dev", "count", "first", "gaps",
    "last", "least_squares", "max", "min", "gaps", "merge", "sum"];

export function fromObject(object: any): Aggregator {
  if (object.name in RANGE_AGGREGATORS) {
      return RangeAggregator.fromObject(object);
  } else if (object.name === PercentileAggregator.NAME) {
      return PercentileAggregator.fromObject(object);
  } else if (object.name === SmaAggregator.NAME) {
      return SmaAggregator.fromObject(object);
  } else if (object.name === DivideAggregator.NAME) {
      return DivideAggregator.fromObject(object);
  } else if (object.name === RateAggregator.NAME) {
      return RateAggregator.fromObject(object);
  } else if (object.name === SamplerAggregator.NAME) {
      return SamplerAggregator.fromObject(object);
  } else if (object.name === ScaleAggregator.NAME) {
      return ScaleAggregator.fromObject(object);
  } else if (object.name === TrimAggregator.NAME) {
      return TrimAggregator.fromObject(object);
  } else if (object.name === "diff") {
      return new Aggregator("diff");
  }

  return object;
}
