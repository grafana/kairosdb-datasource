import { Aggregator } from "../aggregators/aggregator";
import { GroupBy } from "./group_by";
export declare class KairosDBTarget {
    static fromObject(object: any): KairosDBTarget;
    metricName: string;
    alias: string;
    tags: {
        [key: string]: string[];
    };
    groupBy: GroupBy;
    aggregators: Aggregator[];
    asString(): string;
}
