import {GroupByTimeEntry} from "../../directives/group_by/group_by_time_entry";

export class GroupBy {
    public tags: string[] = [];
    public value: string[] = [];
    public time: GroupByTimeEntry[] = [];
}
