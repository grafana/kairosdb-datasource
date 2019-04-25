System.register(["./aggregator", "./parameters/any_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var aggregator_1, any_aggregator_parameter_1;
    var SmaAggregator;
    return {
        setters:[
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            }],
        execute: function() {
            SmaAggregator = (function (_super) {
                __extends(SmaAggregator, _super);
                function SmaAggregator() {
                    _super.call(this, "sma");
                    this.parameters = this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter("size")]);
                }
                return SmaAggregator;
            })(aggregator_1.Aggregator);
            exports_1("SmaAggregator", SmaAggregator);
        }
    }
});
//# sourceMappingURL=sma_aggregator.js.map