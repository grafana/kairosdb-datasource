import { MetricQuery } from "./metric_query";
export interface Moment {
    unix(): any;
}
export declare class DatapointsQuery {
    start_absolute: number;
    end_absolute: number;
    metrics: MetricQuery[];
    cache_time: number;
    constructor(startAbsolute: Moment, endAbsolute: Moment, metrics: MetricQuery[]);
}
