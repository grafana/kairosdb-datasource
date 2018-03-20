import {Aggregator} from "../aggregators/aggregator";
import {GroupBy} from "./group_by";

export class KairosDBTarget {
    public metricName: string = undefined;
    public alias: string = undefined;
    public tags: {[key: string]: string[]} = {};
    public groupBy: GroupBy = new GroupBy();
    public aggregators: Aggregator[] = [];
}
