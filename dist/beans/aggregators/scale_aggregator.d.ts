import { Aggregator } from "./aggregator";
export declare class ScaleAggregator extends Aggregator {
    static readonly NAME: string;
    static fromObject(object: any): ScaleAggregator;
    constructor();
}
