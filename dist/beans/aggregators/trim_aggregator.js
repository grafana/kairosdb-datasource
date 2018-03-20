System.register(["./aggregator", "./parameters/enum_aggregator_parameter", "./utils"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var aggregator_1, enum_aggregator_parameter_1, utils_1;
    var TrimAggregator;
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
            TrimAggregator = (function (_super) {
                __extends(TrimAggregator, _super);
                function TrimAggregator() {
                    _super.call(this, "trim");
                    this.parameters = this.parameters.concat([new enum_aggregator_parameter_1.EnumAggregatorParameter("trim", utils_1.Trim, "by")]);
                }
                return TrimAggregator;
            })(aggregator_1.Aggregator);
            exports_1("TrimAggregator", TrimAggregator);
        }
    }
});
//# sourceMappingURL=trim_aggregator.js.map