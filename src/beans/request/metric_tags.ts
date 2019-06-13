import _ from "lodash";

export class MetricTags {
    public tags: {[key: string]: string[]} = {};
    public size: number;
    public initialized: boolean = false;
    public combinations: number = 0;
    public multiValuedTags: string[];

    public updateTags(tags) {
        this.tags = tags;
        this.updateInfo();
        this.initialized = true;
    }

    private updateInfo() {
        const notEmptyTags = _.pickBy(this.tags, (value) => value.length);
        this.combinations =
            _.reduce(_.map(notEmptyTags, (values) => values.length), (length1, length2) => length1 * length2);
        this.multiValuedTags = _.keys(_.pickBy(notEmptyTags, (tagValues) => tagValues.length > 1));
        this.size = _.keys(this.tags).length;
    }
}
