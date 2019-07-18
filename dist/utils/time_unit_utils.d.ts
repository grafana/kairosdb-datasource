import { TimeUnit } from "../beans/aggregators/utils";
export declare class TimeUnitUtils {
    static extractUnit(interval: string): string;
    static extractValue(interval: string): string;
    static convertTimeUnit(unit: string): string;
    static getShortUnit(unit: string): string;
    static getString(unit: TimeUnit): string;
    private static TIME_UNIT_STRINGS;
    private static SHORT_UNITS;
    private static LONG_UNITS;
    private static MEDIUM_UNITS;
}
