import { TimeUnit, UnitValue } from "../beans/aggregators/utils";
export declare class TimeUnitUtils {
    static extractUnit(interval: string): string;
    static extractValue(interval: string): string;
    static extractFloatValue(interval: string): number;
    static convertTimeUnit(unit: string): string;
    static getShortUnit(unit: string): string;
    static getString(unit: TimeUnit): string;
    static ceilingToAvailableUnit(interval: string, availableUnits: UnitValue[]): [string, string];
    static intervalToUnitValue(interval: string): UnitValue;
    static intervalsToUnitValues(intervals: string): UnitValue[] | undefined;
    static unitValueToMillis(unitValue: [TimeUnit, number]): number;
    static intervalToMillis(interval: string): number;
    static timeUnitToMillis(unit: TimeUnit): number;
    private static TIME_UNIT_STRINGS;
    private static SHORT_UNITS;
    private static LONG_UNITS;
    private static getTimeUnit;
}
