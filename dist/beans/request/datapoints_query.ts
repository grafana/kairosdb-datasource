import {MetricQuery} from "./metric_query";

// todo: to be replaced with grafana-sdk-mock
export interface Moment {
    unix();
}

export class DatapointsQuery {
    public start_absolute: number;
    public end_absolute: number;
    public metrics: MetricQuery[];
    public cache_time: number = 0;

    constructor(startAbsolute: Moment, endAbsolute: Moment, metrics: MetricQuery[]) {
        this.start_absolute = startAbsolute.unix() * 1000;
        this.end_absolute = endAbsolute.unix() * 1000;
        this.metrics = metrics;
    }
}
