import _ from "lodash";

export class SeriesNameBuilder {
    private static SEPARATOR = "_";

    public build(metricName, alias, groupBys = []) {
        const tagGroupBys = _.find(groupBys, (groupBy) => groupBy.name === "tag"),
            tagGroupBysValues = this.getTagGroupBys(tagGroupBys),
            valueGroupBysValues = this.getValueGroupBys(groupBys),
            timeGroupBysValues = this.getTimeGroupBys(groupBys);
        if (_.isEmpty(alias)) {
            // return "tag1=value1 tag2=value2" or simply "metricName"
            const groupBysName = this.buildDefault(tagGroupBysValues, valueGroupBysValues, timeGroupBysValues);
            return _.isEmpty(groupBysName) ? metricName : groupBysName;
        } else if (alias.indexOf("$_") >= 0 ) {
            // evaluate expressions in alias
            return this.buildAlias(alias, tagGroupBys, valueGroupBysValues, timeGroupBysValues);
        } else {
            // return "alias (tag1=value1 tag2=value2)" or simply "alias"
            const groupBysName = this.buildDefault(tagGroupBysValues, valueGroupBysValues, timeGroupBysValues);
            return _.isEmpty(groupBysName) ? alias : alias + " (" + groupBysName + ")";
        }
    }

    private buildDefault(tagGroupBysValues, valueGroupBysValues, timeGroupBysValues): string {
        return _.chain([tagGroupBysValues, valueGroupBysValues, timeGroupBysValues])
            .flattenDeep()
            .compact()
            .join(" ")
            .value();
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
        return _.isNil(groupBys) ? [] : _.map(groupBys.group, (value, tag) => tag + "=" + value);
    }

    private getValueGroupBys(groupBys): string[] {
        return groupBys
            .filter((groupBy) => groupBy.name === "value")
            .map((groupBy) => "value_group=" + groupBy.group.group_number);
    }

    private getTimeGroupBys(groupBys): string[] {
        return groupBys
            .filter((groupBy) => groupBy.name === "time")
            .map((groupBy) => "time_group=" + groupBy.group.group_number);
    }

    private getGroupByExpression(type: string, value: string) {
        return "$_" + type + "_group_" + value;
    }
}
