import { Aggregator } from "./aggregator";
import { RangeAggregator } from "./range_aggregator";
export declare const AGGREGATORS: RangeAggregator[];
export declare const SCALAR_AGGREGATOR_NAMES: string[];
export declare const RANGE_AGGREGATOR_NAMES: string[];
export declare function fromObject(object: Aggregator): Aggregator;
