import {Aggregator} from "./aggregator";
import {ApdexAggregator} from "./apdex_aggregator";
import {DivideAggregator} from "./divide_aggregator";
import {FilterAggregator} from "./filter_aggregator";
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
    new RangeAggregator("merge"),
    new RangeAggregator("movingWindow"),
    new PercentileAggregator(),
    new ApdexAggregator(),
    new SmaAggregator(),
    new RangeAggregator("sum"),
    new Aggregator("diff"),
    new DivideAggregator(),
    new RateAggregator(),
    new SamplerAggregator(),
    new ScaleAggregator(),
    new TrimAggregator(),
    new FilterAggregator(),
    new Aggregator("percent_remaining")
].sort( (a, b) => a.name.localeCompare(b.name));

const RANGE_AGGREGATORS = ["avg", "dev", "count", "first", "gaps",
    "last", "least_squares", "max", "min", "gaps", "merge", "sum", "movingWindow"];

export function fromObject(object: any): Aggregator {
  if (RANGE_AGGREGATORS.indexOf(object.name) >= 0) {
      return RangeAggregator.fromObject(object);
  } else if (object.name === PercentileAggregator.NAME) {
      return PercentileAggregator.fromObject(object);
  } else if (object.name === ApdexAggregator.NAME) {
      return ApdexAggregator.fromObject(object);
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
  } else if (object.name === FilterAggregator.NAME) {
      return FilterAggregator.fromObject(object);
  } else if (object.name === "percent_remaining") {
      return new Aggregator("percent_remaining");
  }

  return object;
}
