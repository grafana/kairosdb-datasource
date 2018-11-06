"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GroupByTimeEntry = /** @class */ (function () {
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
exports.GroupByTimeEntry = GroupByTimeEntry;
