export declare class MetricQuery {
    name: string;
    tags: any;
    limit: number;
    aggregators: any[];
    group_by: any[];
    constructor(name: string, tags: any, aggregators: any[], group_by: any[]);
}
