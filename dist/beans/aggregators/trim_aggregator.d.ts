import { Aggregator } from "./aggregator";
export declare class TrimAggregator extends Aggregator {
    static readonly NAME: string;
    static fromObject(object: any): TrimAggregator;
    constructor();
}
