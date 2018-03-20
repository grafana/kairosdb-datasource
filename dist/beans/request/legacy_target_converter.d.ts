import { KairosDBTarget } from "./target";
export declare class LegacyTargetConverter {
    convert(oldTarget: any): KairosDBTarget;
    isApplicable(target: any): boolean;
    private mapGroupByTime(groupBy);
    private mapGroupByValue(groupBy);
    private convertLegacyRangeAggregator(horizontalAggregator);
    private convertLegacyPercentileAggregator(horizontalAggregator);
    private convertLegacyAggregator(horizontalAggregator);
    private findParameterIndex(aggregator, parameterName);
}
