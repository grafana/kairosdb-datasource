System.register(["./aggregator", "./parameters/any_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var aggregator_1, any_aggregator_parameter_1;
    var ScaleAggregator;
    return {
        setters:[
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            }],
        execute: function() {
            ScaleAggregator = (function (_super) {
                __extends(ScaleAggregator, _super);
                function ScaleAggregator() {
                    _super.call(this, "scale");
                    this.parameters = this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter("factor", "by")]);
                }
                return ScaleAggregator;
            })(aggregator_1.Aggregator);
            exports_1("ScaleAggregator", ScaleAggregator);
        }
    }
});
//# sourceMappingURL=scale_aggregator.js.map