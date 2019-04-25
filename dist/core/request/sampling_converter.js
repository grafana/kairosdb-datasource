System.register(["app/core/utils/kbn", "../../beans/aggregators/utils", "../../utils/time_unit_utils"], function(exports_1) {
    var kbn_1, utils_1, time_unit_utils_1;
    var SamplingConverter;
    return {
        setters:[
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (time_unit_utils_1_1) {
                time_unit_utils_1 = time_unit_utils_1_1;
            }],
        execute: function() {
            SamplingConverter = (function () {
                function SamplingConverter() {
                }
                SamplingConverter.prototype.convert = function (value, unit) {
                    if (unit === SamplingConverter.MILLISECONDS_STRING) {
                        throw new Error("Value must be integer when using milliseconds");
                    }
                    var shortUnit = time_unit_utils_1.TimeUnitUtils.getShortUnit(unit);
                    return {
                        interval: this.convertToMiliseconds(parseFloat(value), shortUnit).toString(),
                        unit: time_unit_utils_1.TimeUnitUtils.getString(utils_1.TimeUnit.MILLISECONDS)
                    };
                };
                SamplingConverter.prototype.isApplicable = function (value) {
                    return this.isFloat(value);
                };
                SamplingConverter.prototype.isFloat = function (value) {
                    return value % 1 !== 0;
                };
                SamplingConverter.prototype.convertToMiliseconds = function (value, shortUnit) {
                    return Math.round(kbn_1.default.intervals_in_seconds[shortUnit] * value * 1000);
                };
                SamplingConverter.MILLISECONDS_STRING = time_unit_utils_1.TimeUnitUtils.getString(utils_1.TimeUnit.MILLISECONDS);
                return SamplingConverter;
            })();
            exports_1("SamplingConverter", SamplingConverter);
        }
    }
});
//# sourceMappingURL=sampling_converter.js.map