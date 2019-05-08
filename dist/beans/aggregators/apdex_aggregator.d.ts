import { RangeAggregator } from "./range_aggregator";
export declare class ApdexAggregator extends RangeAggregator {
    static NAME: string;
    static fromObject(object: any): ApdexAggregator;
    constructor();
}
