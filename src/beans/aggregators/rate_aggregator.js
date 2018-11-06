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
var aggregator_1 = require("./aggregator");
var alignment_aggregator_parameter_1 = require("./parameters/alignment_aggregator_parameter");
var enum_aggregator_parameter_1 = require("./parameters/enum_aggregator_parameter");
var utils_1 = require("./utils");
var RateAggregator = /** @class */ (function (_super) {
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
exports.RateAggregator = RateAggregator;
