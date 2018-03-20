System.register([], function(exports_1) {
    var TemplatingFunction;
    return {
        setters:[],
        execute: function() {
            TemplatingFunction = (function () {
                function TemplatingFunction(name, body) {
                    this.name = name;
                    this.body = body;
                    this.regexp = this.getRegexp();
                }
                TemplatingFunction.prototype.run = function (args) {
                    return this.body.apply(this, args);
                };
                TemplatingFunction.prototype.getRegexp = function () {
                    return "^" + this.name + "\\(([\\S ]+)\\)" + "$";
                };
                return TemplatingFunction;
            })();
            exports_1("TemplatingFunction", TemplatingFunction);
        }
    }
});
//# sourceMappingURL=function.js.map