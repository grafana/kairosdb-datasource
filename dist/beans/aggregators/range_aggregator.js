System.register(["../../directives/auto_value_switch", "./aggregator", "./parameters/alignment_aggregator_parameter", "./parameters/sampling_aggregator_parameter", "./parameters/sampling_unit_aggregator_parameter"], function (exports_1, context_1) {
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
    var auto_value_switch_1, aggregator_1, alignment_aggregator_parameter_1, sampling_aggregator_parameter_1, sampling_unit_aggregator_parameter_1, RangeAggregator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (auto_value_switch_1_1) {
                auto_value_switch_1 = auto_value_switch_1_1;
            },
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (alignment_aggregator_parameter_1_1) {
                alignment_aggregator_parameter_1 = alignment_aggregator_parameter_1_1;
            },
            function (sampling_aggregator_parameter_1_1) {
                sampling_aggregator_parameter_1 = sampling_aggregator_parameter_1_1;
            },
            function (sampling_unit_aggregator_parameter_1_1) {
                sampling_unit_aggregator_parameter_1 = sampling_unit_aggregator_parameter_1_1;
            }
        ],
        execute: function () {
            RangeAggregator = (function (_super) {
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
            exports_1("RangeAggregator", RangeAggregator);
        }
    };
});
//# sourceMappingURL=range_aggregator.js.map