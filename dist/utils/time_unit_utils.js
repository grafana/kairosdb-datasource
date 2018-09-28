System.register(["lodash", "../beans/aggregators/utils"], function(exports_1) {
    var lodash_1, utils_1;
    var TimeUnitUtils;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
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
                TimeUnitUtils.convertTimeUnit = function (unit) {
                    return TimeUnitUtils.SHORT_UNITS[unit] || TimeUnitUtils.LONG_UNITS[unit];
                };
                TimeUnitUtils.getShortUnit = function (unit) {
                    return lodash_1.default.invert(TimeUnitUtils.SHORT_UNITS)[unit];
                };
                TimeUnitUtils.getString = function (unit) {
                    return utils_1.TimeUnit[unit];
                };
                TimeUnitUtils.convertFromInterval = function (intervalString) {
                    var interval_regex = /(\d+(?:\.\d+)?)([Mwdhmsy])/;
                    var interval_regex_ms = /(\d+(?:\.\d+)?)(ms)/;
                    var matches = intervalString.match(interval_regex_ms);
                    if (!matches) {
                        matches = intervalString.match(interval_regex);
                    }
                    if (!matches) {
                        throw new Error('Expecting a number followed by one of "y M w d h m s ms"');
                    }
                    var value = matches[1];
                    var unit = TimeUnitUtils.convertTimeUnit(matches[2]);
                    return {
                        value: value,
                        unit: unit
                    };
                };
                TimeUnitUtils.TIME_UNIT_STRINGS = lodash_1.default.values(utils_1.EnumValues(utils_1.TimeUnit));
                TimeUnitUtils.SHORT_UNITS = lodash_1.default.zipObject(["ms", "s", "m", "h", "d", "w", "M", "y"], TimeUnitUtils.TIME_UNIT_STRINGS);
                TimeUnitUtils.LONG_UNITS = lodash_1.default.zipObject(["millisecond", "second", "minute", "hour", "day", "week", "month", "year"], TimeUnitUtils.TIME_UNIT_STRINGS);
                return TimeUnitUtils;
            })();
            exports_1("TimeUnitUtils", TimeUnitUtils);
        }
    }
});
//# sourceMappingURL=time_unit_utils.js.map