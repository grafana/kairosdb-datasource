System.register([], function (exports_1, context_1) {
    "use strict";
    var Aggregator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Aggregator = (function () {
                function Aggregator(name) {
                    this.parameters = [];
                    this.autoValueSwitch = undefined;
                    this.name = name;
                }
                return Aggregator;
            }());
            exports_1("Aggregator", Aggregator);
        }
    };
});
//# sourceMappingURL=aggregator.js.map