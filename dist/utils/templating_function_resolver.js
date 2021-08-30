System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var TemplatingFunctionResolver;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            TemplatingFunctionResolver = (function () {
                function TemplatingFunctionResolver(templatingUtils) {
                    this.templatingUtils = templatingUtils;
                }
                TemplatingFunctionResolver.prototype.unpackFunction = function (scopedVar, matchedFunction, functionBody) {
                    var _this = this;
                    var matched = functionBody.match(matchedFunction.regexp);
                    var args = matched[1].split(TemplatingFunctionResolver.FUNCTION_ARGUMENTS_SEPARATOR).map(function (arg) { return arg.trim(); });
                    var replacedArgs = args.map(function (argument) { return _this.templatingUtils.replace(argument)[0]; });
                    var simpleArgs = replacedArgs.filter(function (argument) { return !_this.isFilterArgument(argument); });
                    var filters = lodash_1.default.difference(replacedArgs, simpleArgs).map(function (filterArgument) { return _this.mapToFilter(filterArgument); });
                    return function () { return matchedFunction.body.apply(matchedFunction, simpleArgs.concat([filters.reduce(function (filter1, filter2) { return lodash_1.default.merge(filter1, filter2); }, {})])); };
                };
                TemplatingFunctionResolver.prototype.mapToFilter = function (filter) {
                    var filterParams = filter.split(TemplatingFunctionResolver.FILTER_ARGUMENT_SEPARATOR);
                    var filterEntry = {};
                    filterEntry[filterParams[0]] = this.templatingUtils.replace(filterParams[1]);
                    return filterEntry;
                };
                TemplatingFunctionResolver.prototype.isFilterArgument = function (argument) {
                    return TemplatingFunctionResolver.FILTER_ARGUMENT_REGEXP.test(argument);
                };
                TemplatingFunctionResolver.FUNCTION_ARGUMENTS_SEPARATOR = ",";
                TemplatingFunctionResolver.FILTER_ARGUMENT_SEPARATOR = "=";
                TemplatingFunctionResolver.FILTER_ARGUMENT_REGEXP = new RegExp("^\\S+" + TemplatingFunctionResolver.FILTER_ARGUMENT_SEPARATOR);
                return TemplatingFunctionResolver;
            })();
            exports_1("TemplatingFunctionResolver", TemplatingFunctionResolver);
        }
    }
});
//# sourceMappingURL=templating_function_resolver.js.map