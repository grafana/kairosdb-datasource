System.register(["../utils", "./enum_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var utils_1, enum_aggregator_parameter_1;
    var SamplingUnitAggregatorParameter;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (enum_aggregator_parameter_1_1) {
                enum_aggregator_parameter_1 = enum_aggregator_parameter_1_1;
            }],
        execute: function() {
            SamplingUnitAggregatorParameter = (function (_super) {
                __extends(SamplingUnitAggregatorParameter, _super);
                function SamplingUnitAggregatorParameter() {
                    _super.call(this, "unit", utils_1.TimeUnit, "unit", "HOURS");
                    this.type = SamplingUnitAggregatorParameter.TYPE;
                }
                SamplingUnitAggregatorParameter.TYPE = "sampling_unit";
                return SamplingUnitAggregatorParameter;
            })(enum_aggregator_parameter_1.EnumAggregatorParameter);
            exports_1("SamplingUnitAggregatorParameter", SamplingUnitAggregatorParameter);
        }
    }
});
//# sourceMappingURL=sampling_unit_aggregator_parameter.js.map