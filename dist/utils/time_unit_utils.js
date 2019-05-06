System.register(["lodash", "../beans/aggregators/utils"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, utils_1, TimeUnitUtils;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            TimeUnitUtils = (function () {
                function TimeUnitUtils() {
                }
                TimeUnitUtils.extractUnit = function (interval) {
                    var timeValue = this.extractValue(interval);
                    return interval.replace(timeValue, "");
                };
                TimeUnitUtils.extractValue = function (interval) {
                    return parseFloat(interval).toString();
                };
                TimeUnitUtils.extractFloatValue = function (interval) {
                    return parseFloat(interval);
                };
                TimeUnitUtils.convertTimeUnit = function (unit) {
                    return TimeUnitUtils.SHORT_UNITS[unit] || TimeUnitUtils.LONG_UNITS[unit];
                };
                TimeUnitUtils.getShortUnit = function (unit) {
                    return lodash_1.default.invert(TimeUnitUtils.SHORT_UNITS)[unit];
                };
                TimeUnitUtils.getString = function (unit) {
                    return utils_1.TimeUnit[unit];
                };
                TimeUnitUtils.ceilingToAvailableUnit = function (interval, availableUnits) {
                    var intervalMillis = this.intervalToMillis(interval);
                    for (var _i = 0, availableUnits_1 = availableUnits; _i < availableUnits_1.length; _i++) {
                        var unitValue = availableUnits_1[_i];
                        var unit = unitValue[0];
                        var value = unitValue[1];
                        if (value * this.timeUnitToMillis(unit) >= intervalMillis) {
                            return [utils_1.TimeUnit[unit], value.toString()];
                        }
                    }
                    var max = availableUnits[availableUnits.length - 1];
                    return [utils_1.TimeUnit[max[0]], max[1].toString()];
                };
                TimeUnitUtils.intervalToUnitValue = function (interval) {
                    return [this.getTimeUnit(this.extractUnit(interval)), this.extractFloatValue(interval)];
                };
                TimeUnitUtils.intervalsToUnitValues = function (intervals) {
                    var _this = this;
                    if (intervals) {
                        return intervals.replace(" ", "")
                            .split(",")
                            .map(function (interval) { return _this.intervalToUnitValue(interval); })
                            .filter(function (value) { return value[0] !== undefined && value[1] > 0; })
                            .sort(function (a, b) {
                            return _this.unitValueToMillis(a) - _this.unitValueToMillis(b);
                        });
                    }
                    else {
                        return undefined;
                    }
                };
                TimeUnitUtils.unitValueToMillis = function (unitValue) {
                    return unitValue[1] * this.timeUnitToMillis(unitValue[0]);
                };
                TimeUnitUtils.intervalToMillis = function (interval) {
                    var value = this.extractFloatValue(interval);
                    var unit = this.getTimeUnit(this.extractUnit(interval));
                    return value * this.timeUnitToMillis(unit);
                };
                TimeUnitUtils.timeUnitToMillis = function (unit) {
                    switch (unit) {
                        case utils_1.TimeUnit.MILLISECONDS:
                            return 1;
                        case utils_1.TimeUnit.SECONDS:
                            return 1000;
                        case utils_1.TimeUnit.MINUTES:
                            return 60 * 1000;
                        case utils_1.TimeUnit.HOURS:
                            return 60 * 60 * 1000;
                        case utils_1.TimeUnit.DAYS:
                            return 24 * 60 * 60 * 1000;
                        case utils_1.TimeUnit.WEEKS:
                            return 7 * 24 * 60 * 60 * 1000;
                        case utils_1.TimeUnit.MONTHS:
                            return 30 * 24 * 60 * 60 * 1000;
                        case utils_1.TimeUnit.YEARS:
                            return 365 * 24 * 60 * 60 * 1000;
                    }
                };
                TimeUnitUtils.getTimeUnit = function (unit) {
                    return utils_1.TimeUnit[this.convertTimeUnit(unit)];
                };
                TimeUnitUtils.TIME_UNIT_STRINGS = lodash_1.default.values(utils_1.EnumValues(utils_1.TimeUnit));
                TimeUnitUtils.SHORT_UNITS = lodash_1.default.zipObject(["ms", "s", "m", "h", "d", "w", "M", "y"], TimeUnitUtils.TIME_UNIT_STRINGS);
                TimeUnitUtils.LONG_UNITS = lodash_1.default.zipObject(["millisecond", "second", "minute", "hour", "day", "week", "month", "year"], TimeUnitUtils.TIME_UNIT_STRINGS);
                return TimeUnitUtils;
            }());
            exports_1("TimeUnitUtils", TimeUnitUtils);
        }
    };
});
//# sourceMappingURL=time_unit_utils.js.map