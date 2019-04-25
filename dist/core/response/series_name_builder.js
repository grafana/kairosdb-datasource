System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var SeriesNameBuilder;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            SeriesNameBuilder = (function () {
                function SeriesNameBuilder() {
                }
                SeriesNameBuilder.prototype.build = function (metricName, alias, groupBys) {
                    if (groupBys === void 0) { groupBys = []; }
                    var tagGroupBys = lodash_1.default.find(groupBys, function (groupBy) { return groupBy.name === "tag"; }), tagGroupBysValues = this.getTagGroupBys(tagGroupBys), valueGroupBysValues = this.getValueGroupBys(groupBys), timeGroupBysValues = this.getTimeGroupBys(groupBys);
                    return alias ? this.buildAlias(alias, tagGroupBys, valueGroupBysValues, timeGroupBysValues) :
                        this.buildDefault(metricName, tagGroupBysValues, valueGroupBysValues, timeGroupBysValues);
                };
                SeriesNameBuilder.prototype.buildDefault = function (metricName, tagGroupBysValues, valueGroupBysValues, timeGroupBysValues) {
                    return lodash_1.default.flatten([metricName, tagGroupBysValues, valueGroupBysValues, timeGroupBysValues])
                        .filter(function (part) { return !lodash_1.default.isEmpty(part); })
                        .join(SeriesNameBuilder.SEPARATOR);
                };
                SeriesNameBuilder.prototype.buildAlias = function (alias, tagGroupBys, valueGroupBysValues, timeGroupBysValues) {
                    var _this = this;
                    var replacedAlias = alias;
                    if (!lodash_1.default.isNil(tagGroupBys)) {
                        lodash_1.default.mapKeys(tagGroupBys.group, function (value, tag) {
                            replacedAlias = replacedAlias.replace(_this.getGroupByExpression("tag", tag), value);
                        });
                    }
                    valueGroupBysValues.map(function (valueGroupBy, index) {
                        replacedAlias = replacedAlias.replace(_this.getGroupByExpression("value", index), valueGroupBy);
                    });
                    timeGroupBysValues.map(function (timeGroupBy, index) {
                        replacedAlias = replacedAlias.replace(_this.getGroupByExpression("time", index), timeGroupBy);
                    });
                    return replacedAlias;
                };
                SeriesNameBuilder.prototype.getTagGroupBys = function (groupBys) {
                    return lodash_1.default.isNil(groupBys) ? [] : lodash_1.default.values(groupBys.group);
                };
                SeriesNameBuilder.prototype.getValueGroupBys = function (groupBys) {
                    return groupBys
                        .filter(function (groupBy) { return groupBy.name === "value"; })
                        .map(function (groupBy) { return "G" + groupBy.group.group_number; });
                };
                SeriesNameBuilder.prototype.getTimeGroupBys = function (groupBys) {
                    return groupBys
                        .filter(function (groupBy) { return groupBy.name === "time"; })
                        .map(function (groupBy) { return "G" + groupBy.group.group_number + SeriesNameBuilder.SEPARATOR + groupBy.group_count; });
                };
                SeriesNameBuilder.prototype.getGroupByExpression = function (type, value) {
                    return "$_" + type + "_group_" + value;
                };
                SeriesNameBuilder.SEPARATOR = "_";
                return SeriesNameBuilder;
            })();
            exports_1("SeriesNameBuilder", SeriesNameBuilder);
        }
    }
});
//# sourceMappingURL=series_name_builder.js.map