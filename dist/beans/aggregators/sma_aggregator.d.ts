import { Aggregator } from "./aggregator";
export declare class SmaAggregator extends Aggregator {
    static readonly NAME: string;
    static fromObject(object: any): SmaAggregator;
    constructor();
}
