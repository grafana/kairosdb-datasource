System.register(["./any_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var any_aggregator_parameter_1;
    var SamplingAggregatorParameter;
    return {
        setters:[
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            }],
        execute: function() {
            SamplingAggregatorParameter = (function (_super) {
                __extends(SamplingAggregatorParameter, _super);
                function SamplingAggregatorParameter(text, value) {
                    if (text === void 0) { text = name; }
                    if (value === void 0) { value = null; }
                    _super.call(this, "value", text, value);
                    this.type = SamplingAggregatorParameter.TYPE;
                }
                SamplingAggregatorParameter.TYPE = "sampling";
                return SamplingAggregatorParameter;
            })(any_aggregator_parameter_1.AnyAggregatorParameter);
            exports_1("SamplingAggregatorParameter", SamplingAggregatorParameter);
        }
    }
});
//# sourceMappingURL=sampling_aggregator_parameter.js.map