System.register([], function(exports_1) {
    var PromiseUtils;
    return {
        setters:[],
        execute: function() {
            PromiseUtils = (function () {
                function PromiseUtils($q) {
                    this.$q = $q;
                }
                PromiseUtils.prototype.resolvedPromise = function (value) {
                    var defer = this.$q.defer();
                    defer.resolve(value);
                    return defer.promise;
                };
                return PromiseUtils;
            })();
            exports_1("PromiseUtils", PromiseUtils);
        }
    }
});
//# sourceMappingURL=promise_utils.js.map