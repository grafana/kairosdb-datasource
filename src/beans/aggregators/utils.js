"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var TimeUnit;
(function (TimeUnit) {
    TimeUnit[TimeUnit["MILLISECONDS"] = 0] = "MILLISECONDS";
    TimeUnit[TimeUnit["SECONDS"] = 1] = "SECONDS";
    TimeUnit[TimeUnit["MINUTES"] = 2] = "MINUTES";
    TimeUnit[TimeUnit["HOURS"] = 3] = "HOURS";
    TimeUnit[TimeUnit["DAYS"] = 4] = "DAYS";
    TimeUnit[TimeUnit["WEEKS"] = 5] = "WEEKS";
    TimeUnit[TimeUnit["MONTHS"] = 6] = "MONTHS";
    TimeUnit[TimeUnit["YEARS"] = 7] = "YEARS";
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
var Trim;
(function (Trim) {
    Trim[Trim["first"] = 0] = "first";
    Trim[Trim["last"] = 1] = "last";
    Trim[Trim["both"] = 2] = "both";
})(Trim = exports.Trim || (exports.Trim = {}));
var Alignment;
(function (Alignment) {
    Alignment[Alignment["NONE"] = 0] = "NONE";
    Alignment[Alignment["START_TIME"] = 1] = "START_TIME";
    Alignment[Alignment["SAMPLING"] = 2] = "SAMPLING";
})(Alignment = exports.Alignment || (exports.Alignment = {}));
function EnumValues(enumType) {
    return lodash_1.default.pickBy(lodash_1.default.values(enumType), function (value) { return !lodash_1.default.isNumber(value); });
}
exports.EnumValues = EnumValues;
