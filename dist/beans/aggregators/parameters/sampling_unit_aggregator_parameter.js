System.register(["../utils", "./enum_aggregator_parameter"], function (exports_1, context_1) {
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
    var utils_1, enum_aggregator_parameter_1, SamplingUnitAggregatorParameter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (enum_aggregator_parameter_1_1) {
                enum_aggregator_parameter_1 = enum_aggregator_parameter_1_1;
            }
        ],
        execute: function () {
            SamplingUnitAggregatorParameter = (function (_super) {
                __extends(SamplingUnitAggregatorParameter, _super);
                function SamplingUnitAggregatorParameter() {
                    var _this = _super.call(this, "unit", utils_1.TimeUnit, "unit", "HOURS") || this;
                    _this.type = SamplingUnitAggregatorParameter.TYPE;
                    return _this;
                }
                SamplingUnitAggregatorParameter.fromObject = function (object) {
                    var rval = new SamplingUnitAggregatorParameter();
                    rval.value = object.value;
                    return rval;
                };
                SamplingUnitAggregatorParameter.TYPE = "sampling_unit";
                return SamplingUnitAggregatorParameter;
            }(enum_aggregator_parameter_1.EnumAggregatorParameter));
            exports_1("SamplingUnitAggregatorParameter", SamplingUnitAggregatorParameter);
        }
    };
});
//# sourceMappingURL=sampling_unit_aggregator_parameter.js.map