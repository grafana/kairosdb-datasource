System.register([], function (exports_1, context_1) {
    "use strict";
    var GroupByTimeEntry;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            GroupByTimeEntry = (function () {
                function GroupByTimeEntry(interval, unit, count) {
                    this.interval = undefined;
                    this.unit = undefined;
                    this.count = undefined;
                    this.interval = interval;
                    this.unit = unit;
                    this.count = count;
                }
                GroupByTimeEntry.prototype.asString = function () {
                    return "time(" + this.interval + ", " + this.unit + ", " + this.count + ")";
                };
                return GroupByTimeEntry;
            }());
            exports_1("GroupByTimeEntry", GroupByTimeEntry);
        }
    };
});
//# sourceMappingURL=group_by_time_entry.js.map