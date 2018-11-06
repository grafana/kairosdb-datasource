import { KairosDBTarget } from "./target";
export declare class LegacyTargetConverter {
    convert(oldTarget: any): KairosDBTarget;
    isApplicable(target: any): boolean;
    private mapGroupByTime;
    private mapGroupByValue;
    private convertLegacyRangeAggregator;
    private convertLegacyPercentileAggregator;
    private convertLegacyAggregator;
    private findParameterIndex;
}
