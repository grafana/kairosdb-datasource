System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var TimeUnit, Trim, Alignment;
    function EnumValues(enumType) {
        return lodash_1.default.pickBy(lodash_1.default.values(enumType), function (value) { return !lodash_1.default.isNumber(value); });
    }
    exports_1("EnumValues", EnumValues);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            (function (TimeUnit) {
                TimeUnit[TimeUnit["MILLISECONDS"] = 0] = "MILLISECONDS";
                TimeUnit[TimeUnit["SECONDS"] = 1] = "SECONDS";
                TimeUnit[TimeUnit["MINUTES"] = 2] = "MINUTES";
                TimeUnit[TimeUnit["HOURS"] = 3] = "HOURS";
                TimeUnit[TimeUnit["DAYS"] = 4] = "DAYS";
                TimeUnit[TimeUnit["WEEKS"] = 5] = "WEEKS";
                TimeUnit[TimeUnit["MONTHS"] = 6] = "MONTHS";
                TimeUnit[TimeUnit["YEARS"] = 7] = "YEARS";
            })(TimeUnit || (TimeUnit = {}));
            exports_1("TimeUnit", TimeUnit);
            (function (Trim) {
                Trim[Trim["first"] = 0] = "first";
                Trim[Trim["last"] = 1] = "last";
                Trim[Trim["both"] = 2] = "both";
            })(Trim || (Trim = {}));
            exports_1("Trim", Trim);
            (function (Alignment) {
                Alignment[Alignment["NONE"] = 0] = "NONE";
                Alignment[Alignment["START_TIME"] = 1] = "START_TIME";
                Alignment[Alignment["SAMPLING"] = 2] = "SAMPLING";
            })(Alignment || (Alignment = {}));
            exports_1("Alignment", Alignment);
        }
    }
});
//# sourceMappingURL=utils.js.map