System.register(["./parameters/any_aggregator_parameter", "./range_aggregator"], function (exports_1, context_1) {
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
    var any_aggregator_parameter_1, range_aggregator_1, PercentileAggregator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            },
            function (range_aggregator_1_1) {
                range_aggregator_1 = range_aggregator_1_1;
            }
        ],
        execute: function () {
            PercentileAggregator = (function (_super) {
                __extends(PercentileAggregator, _super);
                function PercentileAggregator() {
                    var _this = _super.call(this, PercentileAggregator.NAME) || this;
                    _this.parameters = _this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter(PercentileAggregator.NAME, "percentile (0,1]")]);
                    return _this;
                }
                PercentileAggregator.fromObject = function (object) {
                    var rval = new PercentileAggregator();
                    var rangeObj = range_aggregator_1.RangeAggregator.fromObject(object);
                    rval.autoValueSwitch = rangeObj.autoValueSwitch;
                    rval.parameters = rangeObj.parameters.concat([any_aggregator_parameter_1.AnyAggregatorParameter.fromObject(object.parameters[3])]);
                    return rval;
                };
                PercentileAggregator.NAME = "percentile";
                return PercentileAggregator;
            }(range_aggregator_1.RangeAggregator));
            exports_1("PercentileAggregator", PercentileAggregator);
        }
    };
});
//# sourceMappingURL=percentile_aggregator.js.map