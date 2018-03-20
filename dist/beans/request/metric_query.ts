export class MetricQuery {
    public name: string;
    public tags: any;
    public limit: number = 0;
    public aggregators: any[];
    public group_by: any[];

    constructor(name: string, tags: any, aggregators: any[], group_by: any[]) {
        this.name = name;
        this.tags = tags;
        this.aggregators = aggregators;
        this.group_by = group_by;
    }
}
