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

const RANGE_AGGREGATORS = [
    new RangeAggregator("avg"),
    new RangeAggregator("count"),
    new RangeAggregator("dev"),
    new RangeAggregator("first"),
    new RangeAggregator("gaps"),
    new RangeAggregator("last"),
    new RangeAggregator("least_squares"),
    new RangeAggregator("max"),
    // merge intentionally excluded; mportal adds it automatically now
    new RangeAggregator("min"),
    new RangeAggregator("movingWindow"),
    new RangeAggregator("sum"),
];

export const AGGREGATORS = RANGE_AGGREGATORS.concat([
    new Aggregator("diff"),
    new Aggregator("percent_remaining"),
    new ApdexAggregator(),
    new DivideAggregator(),
    new FilterAggregator(),
    new PercentileAggregator(),
    new RateAggregator(),
    new SamplerAggregator(),
    new ScaleAggregator(),
    new SmaAggregator(),
    new TrimAggregator(),
]).sort( (a, b) => a.name.localeCompare(b.name));

// Loosely generated from:
// tslint:disable-next-line
// grep -H -q "doubleDataPointFactory" <path-to-kairosdb-extensions>/kairosdb-extensions/src/main/java/io/inscopemetrics/kairosdb/aggregators
// Many of the java class names are synonyms of the names here.
export const SCALAR_AGGREGATOR_NAMES = [
  "apdex",
  "avg",
  "count",
  "dev",
  "max",
  "min",
  "percentile",
  "percent_remaining",
  "sum",
];
export const RANGE_AGGREGATOR_NAMES = RANGE_AGGREGATORS.map((agg) => agg.name);

export function fromObject(object: Aggregator): Aggregator {
  if (RANGE_AGGREGATOR_NAMES.indexOf(object.name) >= 0) {
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
