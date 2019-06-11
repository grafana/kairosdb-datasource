import _ from "lodash";

export enum TimeUnit {
    MILLISECONDS, SECONDS, MINUTES, HOURS, DAYS, WEEKS, MONTHS, YEARS
}

export type UnitValue = [TimeUnit, number];

export enum Trim {
    first, last, both
}

export enum Alignment {
    NONE, START_TIME, SAMPLING, PERIOD
}

export enum Filter {
    GT, GTE, EQUAL, LTE, LT
}

export function EnumValues(enumType) {
    return _.pickBy(_.values(enumType), (value) => !_.isNumber(value));
}
