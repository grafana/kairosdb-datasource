import _ from "lodash";
import {EnumValues, TimeUnit, UnitValue} from "../beans/aggregators/utils";

export class TimeUnitUtils {
    public static extractUnit(interval: string): string {
        const timeValue: string = this.extractValue(interval);
        return interval.replace(timeValue, "");
    }

    public static extractValue(interval: string): string {
        return parseFloat(interval).toString();
    }

    public static extractFloatValue(interval: string): number {
        return parseFloat(interval);
    }

    public static convertTimeUnit(unit: string): string {
        return TimeUnitUtils.SHORT_UNITS[unit] || TimeUnitUtils.LONG_UNITS[unit];
    }

    public static getShortUnit(unit: string): string {
        return _.invert(TimeUnitUtils.SHORT_UNITS)[unit];
    }

    public static getString(unit: TimeUnit): string {
        return TimeUnit[unit];
    }

    public static ceilingToAvailableUnit(interval: string, availableUnits: UnitValue[]): [string, string] {
      const intervalMillis = this.intervalToMillis(interval);

      // match the first available unit, available Units must be ordered
      for (const unitValue of availableUnits) {
        const unit = unitValue[0];
        const value = unitValue[1];
        if ( value * this.timeUnitToMillis(unit) >= intervalMillis) {
          return [TimeUnit[unit], value.toString()];
        }
      }

      // Nothing matched so return the max UnitValue
      const max = availableUnits[availableUnits.length - 1];
      return [TimeUnit[max[0]], max[1].toString()];
    }

    public static intervalToUnitValue(interval: string): UnitValue {
      return [this.getTimeUnit(this.extractUnit(interval)), this.extractFloatValue(interval)];
    }

    public static intervalsToUnitValues(intervals: string): UnitValue[] | undefined {
      if (intervals) {
        return intervals.replace(" ", "")
          .split(",")
          .map((interval) => this.intervalToUnitValue(interval))
          .filter((value) => value[0] !== undefined && value[1] > 0)
          .sort((a, b) => {
            return this.unitValueToMillis(a) - this.unitValueToMillis(b);
          });
      } else {
        return undefined;
      }
    }

    public static unitValueToMillis(unitValue: [TimeUnit, number]): number {
      return unitValue[1] * this.timeUnitToMillis(unitValue[0]);
    }

    public static intervalToMillis(interval: string) {
      const value = this.extractFloatValue(interval);
      const unit = this.getTimeUnit(this.extractUnit(interval));
      return value * this.timeUnitToMillis(unit);
    }

    public static timeUnitToMillis(unit: TimeUnit) {
      switch (unit) {
        case TimeUnit.MILLISECONDS:
          return 1;
        case TimeUnit.SECONDS:
          return 1000;
        case TimeUnit.MINUTES:
          return 60 * 1000;
        case TimeUnit.HOURS:
          return 60 * 60 * 1000;
        case TimeUnit.DAYS:
          return 24 * 60 * 60 * 1000;
        case TimeUnit.WEEKS: // 7 days
          return 7 * 24 * 60 * 60 * 1000;
        case TimeUnit.MONTHS: // 30 days
          return 30 * 24 * 60 * 60 * 1000;
        case TimeUnit.YEARS: // 365 days
          return 365 * 24 * 60 * 60 * 1000;
      }
    }

    private static TIME_UNIT_STRINGS = _.values(EnumValues(TimeUnit));
    private static SHORT_UNITS = _.zipObject(
        ["ms", "s", "m", "h", "d", "w", "M", "y"],
        TimeUnitUtils.TIME_UNIT_STRINGS);
    private static LONG_UNITS = _.zipObject(
        ["millisecond", "second", "minute", "hour", "day", "week", "month", "year"],
        TimeUnitUtils.TIME_UNIT_STRINGS);

    private static getTimeUnit(unit: string): TimeUnit {
        return TimeUnit[this.convertTimeUnit(unit)];
    }
}
