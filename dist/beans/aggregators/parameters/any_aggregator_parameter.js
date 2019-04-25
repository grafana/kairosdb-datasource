System.register(["./aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var aggregator_parameter_1;
    var AnyAggregatorParameter;
    return {
        setters:[
            function (aggregator_parameter_1_1) {
                aggregator_parameter_1 = aggregator_parameter_1_1;
            }],
        execute: function() {
            AnyAggregatorParameter = (function (_super) {
                __extends(AnyAggregatorParameter, _super);
                function AnyAggregatorParameter(name, text, value) {
                    if (text === void 0) { text = name; }
                    if (value === void 0) { value = null; }
                    _super.call(this, name, text, value);
                    this.type = "any";
                }
                return AnyAggregatorParameter;
            })(aggregator_parameter_1.AggregatorParameter);
            exports_1("AnyAggregatorParameter", AnyAggregatorParameter);
        }
    }
});
//# sourceMappingURL=any_aggregator_parameter.js.map