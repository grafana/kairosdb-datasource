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
Object.defineProperty(exports, "__esModule", { value: true });
var any_aggregator_parameter_1 = require("./parameters/any_aggregator_parameter");
var range_aggregator_1 = require("./range_aggregator");
var PercentileAggregator = /** @class */ (function (_super) {
    __extends(PercentileAggregator, _super);
    function PercentileAggregator() {
        var _this = _super.call(this, PercentileAggregator.NAME) || this;
        _this.parameters = _this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter(PercentileAggregator.NAME)]);
        return _this;
    }
    PercentileAggregator.fromObject = function (object) {
        var rval = new PercentileAggregator();
        var rangeObj = range_aggregator_1.RangeAggregator.fromObject(object);
        rval.parameters = rangeObj.parameters.concat([any_aggregator_parameter_1.AnyAggregatorParameter.fromObject(object.parameters[3])]);
        return rval;
    };
    PercentileAggregator.NAME = "percentile";
    return PercentileAggregator;
}(range_aggregator_1.RangeAggregator));
exports.PercentileAggregator = PercentileAggregator;
