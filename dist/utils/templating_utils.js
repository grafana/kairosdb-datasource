System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var TemplatingUtils;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            TemplatingUtils = (function () {
                function TemplatingUtils(templateSrv, scopedVars) {
                    this.templateSrv = templateSrv;
                    this.scopedVars = scopedVars;
                }
                TemplatingUtils.prototype.replace = function (expression) {
                    var replacedExpression = this.templateSrv.replace(expression, this.scopedVars, this.formatValue);
                    var matchedMultiValues = replacedExpression.match(TemplatingUtils.MULTI_VALUE_REGEX);
                    if (!lodash_1.default.isNil(matchedMultiValues)) {
                        var replacedValues = [replacedExpression];
                        matchedMultiValues.forEach(function (multiValue) {
                            var values = multiValue.substring(3, multiValue.length - 3)
                                .split(TemplatingUtils.MULTI_VALUE_SEPARATOR);
                            replacedValues = lodash_1.default.flatMap(values, function (value) {
                                return replacedValues.map(function (replacedValue) {
                                    return replacedValue.replace(multiValue, value);
                                });
                            });
                        });
                        return replacedValues;
                    }
                    return [replacedExpression];
                };
                TemplatingUtils.prototype.replaceAll = function (expressions) {
                    var _this = this;
                    return lodash_1.default.flatten(expressions.map(function (expression) { return _this.replace(expression); }));
                };
                TemplatingUtils.prototype.formatValue = function (value, variable, originalFormatValueFunc) {
                    if (Array.isArray(value)) {
                        return "##[" + value.join(",") + "]##";
                    }
                    return value;
                };
                TemplatingUtils.MULTI_VALUE_SEPARATOR = ",";
                TemplatingUtils.MULTI_VALUE_REGEX = /##\[.*?\]##/g;
                TemplatingUtils.MULTI_VALUE_BOUNDARIES = /[{}]/g;
                return TemplatingUtils;
            })();
            exports_1("TemplatingUtils", TemplatingUtils);
        }
    }
});
//# sourceMappingURL=templating_utils.js.map