System.register(["./aggregator", "./parameters/any_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var aggregator_1, any_aggregator_parameter_1;
    var DivideAggregator;
    return {
        setters:[
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            }],
        execute: function() {
            DivideAggregator = (function (_super) {
                __extends(DivideAggregator, _super);
                function DivideAggregator() {
                    _super.call(this, "div");
                    this.parameters = this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter("divisor", "by")]);
                }
                return DivideAggregator;
            })(aggregator_1.Aggregator);
            exports_1("DivideAggregator", DivideAggregator);
        }
    }
});
//# sourceMappingURL=divide_aggregator.js.map