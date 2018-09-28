System.register(["../../directives/auto_value_switch", "./aggregator", "./parameters/alignment_aggregator_parameter", "./parameters/sampling_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var auto_value_switch_1, aggregator_1, alignment_aggregator_parameter_1, sampling_aggregator_parameter_1;
    var RangeAggregator;
    return {
        setters:[
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
            }],
        execute: function() {
            RangeAggregator = (function (_super) {
                __extends(RangeAggregator, _super);
                function RangeAggregator(name) {
                    _super.call(this, name);
                    var samplingAggregatorParameter = new sampling_aggregator_parameter_1.SamplingAggregatorParameter("every", "1h");
                    this.parameters = this.parameters.concat([
                        new alignment_aggregator_parameter_1.AlignmentAggregatorParameter(),
                        samplingAggregatorParameter,
                    ]);
                    this.autoValueSwitch = new auto_value_switch_1.AutoValueSwitch([samplingAggregatorParameter]);
                }
                return RangeAggregator;
            })(aggregator_1.Aggregator);
            exports_1("RangeAggregator", RangeAggregator);
        }
    }
});
//# sourceMappingURL=range_aggregator.js.map