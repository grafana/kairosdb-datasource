System.register([], function(exports_1) {
    var AggregatorParameter;
    return {
        setters:[],
        execute: function() {
            AggregatorParameter = (function () {
                function AggregatorParameter(name, text, value) {
                    if (text === void 0) { text = name; }
                    if (value === void 0) { value = null; }
                    this.name = name;
                    this.text = text;
                    this.value = value;
                }
                return AggregatorParameter;
            })();
            exports_1("AggregatorParameter", AggregatorParameter);
        }
    }
});
//# sourceMappingURL=aggregator_parameter.js.map