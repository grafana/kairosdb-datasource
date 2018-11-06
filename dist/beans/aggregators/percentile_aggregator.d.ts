import { RangeAggregator } from "./range_aggregator";
export declare class PercentileAggregator extends RangeAggregator {
    static NAME: string;
    static fromObject(object: any): PercentileAggregator;
    constructor();
}
