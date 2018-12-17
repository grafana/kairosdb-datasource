import { Moment } from "moment";
export interface RawTimeRange {
    from: any;
    to: Moment | string;
}
export declare function getRelativeTimesList(timepickerSettings: any, currentDisplay: any): any;
export declare function describeTextRange(expr: any): any;
export declare function describeTimeRange(range: RawTimeRange): string;
