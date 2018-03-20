import _ from "lodash";

export class SeriesNameBuilder {
    private static SEPARATOR = "_";

    public build(metricName, alias, groupBys = []) {
        const tagGroupBys = _.find(groupBys, (groupBy) => groupBy.name === "tag"),
            tagGroupBysValues = this.getTagGroupBys(tagGroupBys),
            valueGroupBysValues = this.getValueGroupBys(groupBys),
            timeGroupBysValues = this.getTimeGroupBys(groupBys);
        return alias ? this.buildAlias(alias, tagGroupBys, valueGroupBysValues, timeGroupBysValues) :
            this.buildDefault(metricName, tagGroupBysValues, valueGroupBysValues, timeGroupBysValues);
    }

    private buildDefault(metricName, tagGroupBysValues, valueGroupBysValues, timeGroupBysValues): string {
        return _.flatten([metricName, tagGroupBysValues, valueGroupBysValues, timeGroupBysValues])
            .filter((part) => !_.isEmpty(part))
            .join(SeriesNameBuilder.SEPARATOR);
    }

    private buildAlias(alias, tagGroupBys, valueGroupBysValues, timeGroupBysValues): string {
        let replacedAlias = alias;
        if (!_.isNil(tagGroupBys)) {
            _.mapKeys(tagGroupBys.group, (value, tag) => {
                replacedAlias = replacedAlias.replace(this.getGroupByExpression("tag", tag), value);
            });
        }

        valueGroupBysValues.map((valueGroupBy, index) => {
            replacedAlias = replacedAlias.replace(this.getGroupByExpression("value", index), valueGroupBy);
        });

        timeGroupBysValues.map((timeGroupBy, index) => {
            replacedAlias = replacedAlias.replace(this.getGroupByExpression("time", index), timeGroupBy);
        });

        return replacedAlias;
    }

    private getTagGroupBys(groupBys): string[] {
        return _.isNil(groupBys) ? [] : _.values(groupBys.group);
    }

    private getValueGroupBys(groupBys): string[] {
        return groupBys
            .filter((groupBy) => groupBy.name === "value")
            .map((groupBy) => "G" + groupBy.group.group_number);
    }

    private getTimeGroupBys(groupBys): string[] {
        return groupBys
            .filter((groupBy) => groupBy.name === "time")
            .map((groupBy) => "G" + groupBy.group.group_number + SeriesNameBuilder.SEPARATOR + groupBy.group_count);
    }

    private getGroupByExpression(type: string, value: string) {
        return "$_" + type + "_group_" + value;
    }
}
