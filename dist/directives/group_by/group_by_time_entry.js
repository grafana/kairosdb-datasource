System.register([], function(exports_1) {
    var GroupByTimeEntry;
    return {
        setters:[],
        execute: function() {
            GroupByTimeEntry = (function () {
                function GroupByTimeEntry(interval, unit, count) {
                    this.interval = undefined;
                    this.unit = undefined;
                    this.count = undefined;
                    this.interval = interval;
                    this.unit = unit;
                    this.count = count;
                }
                return GroupByTimeEntry;
            })();
            exports_1("GroupByTimeEntry", GroupByTimeEntry);
        }
    }
});
//# sourceMappingURL=group_by_time_entry.js.map