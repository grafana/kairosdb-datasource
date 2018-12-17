import { Moment } from "moment";
import { Aggregator } from "../aggregators/aggregator";
import { GroupBy } from "./group_by";
export interface TimeRange {
    from: Moment | string;
    to: Moment | string;
}
export declare class KairosDBTarget {
    static fromObject(object: any): KairosDBTarget;
    static startTime(target: KairosDBTarget): number;
    static endTime(target: KairosDBTarget): number;
    metricName: string;
    alias: string;
    tags: {
        [key: string]: string[];
    };
    groupBy: GroupBy;
    aggregators: Aggregator[];
    timeRange: TimeRange;
    asString(): string;
}
