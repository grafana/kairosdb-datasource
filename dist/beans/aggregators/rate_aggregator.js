System.register(["./aggregator", "./parameters/alignment_aggregator_parameter", "./parameters/enum_aggregator_parameter", "./utils"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var aggregator_1, alignment_aggregator_parameter_1, enum_aggregator_parameter_1, utils_1, RateAggregator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (alignment_aggregator_parameter_1_1) {
                alignment_aggregator_parameter_1 = alignment_aggregator_parameter_1_1;
            },
            function (enum_aggregator_parameter_1_1) {
                enum_aggregator_parameter_1 = enum_aggregator_parameter_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            RateAggregator = (function (_super) {
                __extends(RateAggregator, _super);
                function RateAggregator() {
                    var _this = _super.call(this, RateAggregator.NAME) || this;
                    _this.parameters = _this.parameters.concat([
                        new alignment_aggregator_parameter_1.AlignmentAggregatorParameter(),
                        new enum_aggregator_parameter_1.EnumAggregatorParameter("unit", utils_1.TimeUnit, "every")
                    ]);
                    return _this;
                }
                RateAggregator.fromObject = function (object) {
                    var rval = new RateAggregator();
                    rval.parameters = [
                        alignment_aggregator_parameter_1.AlignmentAggregatorParameter.fromObject(object.parameters[0]),
                        enum_aggregator_parameter_1.EnumAggregatorParameter.fromObject(object.parameters[1])
                    ];
                    return rval;
                };
                RateAggregator.NAME = "rate";
                return RateAggregator;
            }(aggregator_1.Aggregator));
            exports_1("RateAggregator", RateAggregator);
        }
    };
});
//# sourceMappingURL=rate_aggregator.js.map