import _ from "lodash";
import {EnumValues, TimeUnit} from "../beans/aggregators/utils";

export class TimeUnitUtils {
    public static extractUnit(interval: string): string {
        const timeValue: string = this.extractValue(interval);
        return interval.replace(timeValue, "");
    }

    public static extractValue(interval: string): string {
        return parseFloat(interval).toString();
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

    public static convertFromInterval(intervalString: string) {
        const interval_regex = /(\d+(?:\.\d+)?)([Mwdhmsy])/;
        const interval_regex_ms = /(\d+(?:\.\d+)?)(ms)/;
        let matches = intervalString.match(interval_regex_ms);
        if (!matches) {
            matches = intervalString.match(interval_regex);
        }
        if (!matches) {
            throw new Error('Expecting a number followed by one of "y M w d h m s ms"');
        }

        const value = matches[1];
        const unit = TimeUnitUtils.convertTimeUnit(matches[2]);

        return{
            value,
            unit
        };
    }

    private static TIME_UNIT_STRINGS = _.values(EnumValues(TimeUnit));
    private static SHORT_UNITS = _.zipObject(
        ["ms", "s", "m", "h", "d", "w", "M", "y"],
        TimeUnitUtils.TIME_UNIT_STRINGS);
    private static LONG_UNITS = _.zipObject(
        ["millisecond", "second", "minute", "hour", "day", "week", "month", "year"],
        TimeUnitUtils.TIME_UNIT_STRINGS);
}
