System.register(["./parameters/any_aggregator_parameter", "./range_aggregator"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var any_aggregator_parameter_1, range_aggregator_1;
    var PercentileAggregator;
    return {
        setters:[
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            },
            function (range_aggregator_1_1) {
                range_aggregator_1 = range_aggregator_1_1;
            }],
        execute: function() {
            PercentileAggregator = (function (_super) {
                __extends(PercentileAggregator, _super);
                function PercentileAggregator() {
                    _super.call(this, "percentile");
                    this.parameters = this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter("percentile")]);
                }
                return PercentileAggregator;
            })(range_aggregator_1.RangeAggregator);
            exports_1("PercentileAggregator", PercentileAggregator);
        }
    }
});
//# sourceMappingURL=percentile_aggregator.js.map