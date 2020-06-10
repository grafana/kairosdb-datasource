import { Aggregator } from "./aggregator";
export declare class RateAggregator extends Aggregator {
    static readonly NAME: string;
    static fromObject(object: Aggregator): RateAggregator;
    constructor();
}
