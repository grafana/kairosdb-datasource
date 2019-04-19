import { Aggregator } from "./aggregator";
export declare class FilterAggregator extends Aggregator {
    static NAME: string;
    static fromObject(object: any): FilterAggregator;
    constructor();
}
