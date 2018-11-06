import { Aggregator } from "./aggregator";
export declare class SamplerAggregator extends Aggregator {
    static readonly NAME: string;
    static fromObject(object: any): SamplerAggregator;
    constructor();
}
