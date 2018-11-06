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
var auto_value_switch_1 = require("../../directives/auto_value_switch");
var aggregator_1 = require("./aggregator");
var alignment_aggregator_parameter_1 = require("./parameters/alignment_aggregator_parameter");
var sampling_aggregator_parameter_1 = require("./parameters/sampling_aggregator_parameter");
var sampling_unit_aggregator_parameter_1 = require("./parameters/sampling_unit_aggregator_parameter");
var RangeAggregator = /** @class */ (function (_super) {
    __extends(RangeAggregator, _super);
    function RangeAggregator(name) {
        var _this = _super.call(this, name) || this;
        var samplingAggregatorParameter = new sampling_aggregator_parameter_1.SamplingAggregatorParameter("every", "1");
        var samplingUnitAggregatorParameter = new sampling_unit_aggregator_parameter_1.SamplingUnitAggregatorParameter();
        _this.parameters = _this.parameters.concat([
            new alignment_aggregator_parameter_1.AlignmentAggregatorParameter(),
            samplingAggregatorParameter,
            samplingUnitAggregatorParameter
        ]);
        _this.autoValueSwitch = new auto_value_switch_1.AutoValueSwitch([samplingAggregatorParameter, samplingUnitAggregatorParameter]);
        return _this;
    }
    RangeAggregator.fromObject = function (object) {
        var rval = new RangeAggregator(object.name);
        var alignment = alignment_aggregator_parameter_1.AlignmentAggregatorParameter.fromObject(object.parameters[0]);
        var sampleAgg = sampling_aggregator_parameter_1.SamplingAggregatorParameter.fromObject(object.parameters[1]);
        var sampleUnit = sampling_unit_aggregator_parameter_1.SamplingUnitAggregatorParameter.fromObject(object.parameters[2]);
        rval.parameters = [alignment, sampleAgg, sampleUnit];
        rval.autoValueSwitch = new auto_value_switch_1.AutoValueSwitch([sampleAgg, sampleUnit]);
        return rval;
    };
    return RangeAggregator;
}(aggregator_1.Aggregator));
exports.RangeAggregator = RangeAggregator;
