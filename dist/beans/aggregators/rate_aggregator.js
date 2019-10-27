System.register(["./aggregator", "./parameters/enum_aggregator_parameter", "./utils"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var aggregator_1, enum_aggregator_parameter_1, utils_1;
    var RateAggregator;
    return {
        setters:[
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (enum_aggregator_parameter_1_1) {
                enum_aggregator_parameter_1 = enum_aggregator_parameter_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            RateAggregator = (function (_super) {
                __extends(RateAggregator, _super);
                function RateAggregator() {
                    _super.call(this, "rate");
                    this.parameters = this.parameters.concat([
                        new enum_aggregator_parameter_1.EnumAggregatorParameter("unit", utils_1.TimeUnit, "every")
                    ]);
                }
                return RateAggregator;
            })(aggregator_1.Aggregator);
            exports_1("RateAggregator", RateAggregator);
        }
    }
});
//# sourceMappingURL=rate_aggregator.js.map