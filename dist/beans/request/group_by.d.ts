import { GroupByTimeEntry } from "../../directives/group_by/group_by_time_entry";
export declare class GroupBy {
    static fromObject(object: any): GroupBy;
    tags: string[];
    value: string[];
    time: GroupByTimeEntry[];
    asString(): string;
}
