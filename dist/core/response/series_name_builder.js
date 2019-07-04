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
                    if (!lodash_1.default.isEmpty(alias) && alias.indexOf("$_") >= 0) {
                        // evaluate expressions in alias
                        return this.buildAlias(alias, tagGroupBys, valueGroupBysValues, timeGroupBysValues);
                    }
                    else {
                        // "alias ( tag1=value1 tag2=value2 )" or simply "alias"
                        var groupBysName = this.buildDefault(tagGroupBysValues, valueGroupBysValues, timeGroupBysValues);
                        var prefix = lodash_1.default.isEmpty(alias) ? metricName : alias;
                        return lodash_1.default.isEmpty(groupBysName) ? prefix : prefix + " ( " + groupBysName + " )";
                    }
                };
                SeriesNameBuilder.prototype.buildDefault = function (tagGroupBysValues, valueGroupBysValues, timeGroupBysValues) {
                    return lodash_1.default.chain([tagGroupBysValues, valueGroupBysValues, timeGroupBysValues])
                        .flattenDeep()
                        .compact()
                        .join(" ")
                        .value();
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
                    return lodash_1.default.isNil(groupBys) ? [] : lodash_1.default.map(groupBys.group, function (value, tag) { return tag + "=" + value; });
                };
                SeriesNameBuilder.prototype.getValueGroupBys = function (groupBys) {
                    return groupBys
                        .filter(function (groupBy) { return groupBy.name === "value"; })
                        .map(function (groupBy) { return "value_group=" + groupBy.group.group_number; });
                };
                SeriesNameBuilder.prototype.getTimeGroupBys = function (groupBys) {
                    return groupBys
                        .filter(function (groupBy) { return groupBy.name === "time"; })
                        .map(function (groupBy) { return "time_group=" + groupBy.group.group_number; });
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