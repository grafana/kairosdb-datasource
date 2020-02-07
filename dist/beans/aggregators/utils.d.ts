export declare enum TimeUnit {
    MILLISECONDS = 0,
    SECONDS = 1,
    MINUTES = 2,
    HOURS = 3,
    DAYS = 4,
    WEEKS = 5,
    MONTHS = 6,
    YEARS = 7
}
export declare type UnitValue = [TimeUnit, number];
export declare enum Trim {
    first = 0,
    last = 1,
    both = 2
}
export declare enum Alignment {
    NONE = 0,
    START_TIME = 1,
    SAMPLING = 2,
    PERIOD = 3
}
export declare enum Filter {
    GT = 0,
    GTE = 1,
    EQUAL = 2,
    LTE = 3,
    LT = 4
}
export declare enum Indeterminate {
    keep = 0,
    discard = 1
}
export declare function EnumValues(enumType: any): any;
