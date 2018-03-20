export class GroupByTimeEntry {
    public interval: string = undefined;
    public unit: string = undefined;
    public count: number = undefined;

    constructor(interval: string, unit: string, count: number) {
        this.interval = interval;
        this.unit = unit;
        this.count = count;
    }
}
