System.register(["../../directives/group_by/group_by_time_entry"], function (exports_1, context_1) {
    "use strict";
    var group_by_time_entry_1, GroupBy;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (group_by_time_entry_1_1) {
                group_by_time_entry_1 = group_by_time_entry_1_1;
            }
        ],
        execute: function () {
            GroupBy = (function () {
                function GroupBy() {
                    this.tags = [];
                    this.value = [];
                    this.time = [];
                }
                GroupBy.fromObject = function (object) {
                    var rval = new GroupBy();
                    if (object) {
                        rval.tags = object.tags || [];
                        rval.value = object.value || [];
                        rval.time = (object.time || []).map(function (val) {
                            return new group_by_time_entry_1.GroupByTimeEntry(val.interval, val.unit, val.count);
                        });
                    }
                    return rval;
                };
                GroupBy.prototype.asString = function () {
                    var str = "";
                    var needsSeparator = false;
                    if (this.tags.length > 0 || this.value.length > 0 || this.time.length > 0) {
                        str += " GROUP BY ";
                    }
                    if (this.tags.length > 0) {
                        needsSeparator = true;
                        str += this.tags.join(", ");
                    }
                    if (this.value.length > 0) {
                        if (needsSeparator) {
                            str += ", ";
                        }
                        needsSeparator = true;
                        str += "value(" + this.value.join(",") + ")";
                    }
                    if (this.time.length > 0) {
                        if (needsSeparator) {
                            str += ", ";
                        }
                        str += this.time.map(function (entry) { return entry.asString(); }).join(", ");
                    }
                    return str;
                };
                return GroupBy;
            }());
            exports_1("GroupBy", GroupBy);
        }
    };
});
//# sourceMappingURL=group_by.js.map