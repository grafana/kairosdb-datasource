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
    var any_aggregator_parameter_1, range_aggregator_1, ApdexAggregator;
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
            ApdexAggregator = (function (_super) {
                __extends(ApdexAggregator, _super);
                function ApdexAggregator() {
                    var _this = _super.call(this, ApdexAggregator.NAME) || this;
                    _this.parameters = _this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter("target")]);
                    return _this;
                }
                ApdexAggregator.fromObject = function (object) {
                    var rval = new ApdexAggregator();
                    var rangeObj = range_aggregator_1.RangeAggregator.fromObject(object);
                    rval.autoValueSwitch = rangeObj.autoValueSwitch;
                    rval.parameters = rangeObj.parameters.concat([any_aggregator_parameter_1.AnyAggregatorParameter.fromObject(object.parameters[3])]);
                    return rval;
                };
                ApdexAggregator.NAME = "apdex";
                return ApdexAggregator;
            }(range_aggregator_1.RangeAggregator));
            exports_1("ApdexAggregator", ApdexAggregator);
        }
    };
});
//# sourceMappingURL=apdex_aggregator.js.map