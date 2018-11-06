System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, GroupBysBuilder;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            GroupBysBuilder = (function () {
                function GroupBysBuilder(templatingUtils, samplingConverter) {
                    this.templatingUtils = templatingUtils;
                    this.samplingConverter = samplingConverter;
                }
                GroupBysBuilder.prototype.build = function (groupBysDefinition) {
                    var _this = this;
                    var groupByTags = [];
                    if (!lodash_1.default.isEmpty(groupBysDefinition.tags)) {
                        groupByTags.push({ name: "tag", tags: this.templatingUtils.replaceAll(groupBysDefinition.tags) });
                    }
                    var groupByTime = groupBysDefinition.time.map(function (entry) {
                        return {
                            group_count: entry.count,
                            name: "time",
                            range_size: _this.buildRangeSize(_this.samplingConverter.isApplicable(entry.interval) ?
                                _this.samplingConverter.convert(entry.interval, entry.unit) : entry)
                        };
                    });
                    var groupByValue = groupBysDefinition.value.map(function (entry) {
                        return {
                            name: "value",
                            range_size: entry
                        };
                    });
                    return lodash_1.default.concat(groupByTags, groupByTime, groupByValue);
                };
                GroupBysBuilder.prototype.buildRangeSize = function (parameters) {
                    return {
                        unit: parameters.unit,
                        value: parameters.interval
                    };
                };
                return GroupBysBuilder;
            }());
            exports_1("GroupBysBuilder", GroupBysBuilder);
        }
    };
});
//# sourceMappingURL=group_bys_builder.js.map