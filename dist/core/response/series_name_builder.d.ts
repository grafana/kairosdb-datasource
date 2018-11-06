export declare class SeriesNameBuilder {
    private static SEPARATOR;
    build(metricName: any, alias: any, groupBys?: any[]): string;
    private buildDefault;
    private buildAlias;
    private getTagGroupBys;
    private getValueGroupBys;
    private getTimeGroupBys;
    private getGroupByExpression;
}
