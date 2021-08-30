System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var TemplatingFunctionsCtrl;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            TemplatingFunctionsCtrl = (function () {
                function TemplatingFunctionsCtrl(templatingFunctionResolver) {
                    this.functions = [];
                    this.templatingFunctionResolver = templatingFunctionResolver;
                }
                TemplatingFunctionsCtrl.prototype.register = function (func) {
                    this.functions.push(func);
                };
                TemplatingFunctionsCtrl.prototype.resolve = function (functionBody, scopedVars) {
                    var matchedFunction = lodash_1.default.find(this.functions, function (func) { return new RegExp(func.regexp).test(functionBody); });
                    return this.templatingFunctionResolver.unpackFunction(scopedVars, matchedFunction, functionBody);
                };
                return TemplatingFunctionsCtrl;
            })();
            exports_1("TemplatingFunctionsCtrl", TemplatingFunctionsCtrl);
        }
    }
});
//# sourceMappingURL=templating_functions_ctrl.js.map