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
    var utils_1, enum_aggregator_parameter_1, AlignmentAggregatorParameter;
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
            AlignmentAggregatorParameter = (function (_super) {
                __extends(AlignmentAggregatorParameter, _super);
                function AlignmentAggregatorParameter() {
                    var _this = _super.call(this, "sampling", utils_1.Alignment, "align by", "NONE") || this;
                    _this.type = "alignment";
                    return _this;
                }
                AlignmentAggregatorParameter.fromObject = function (object) {
                    var rval = new AlignmentAggregatorParameter();
                    rval.value = object.value;
                    return rval;
                };
                return AlignmentAggregatorParameter;
            }(enum_aggregator_parameter_1.EnumAggregatorParameter));
            exports_1("AlignmentAggregatorParameter", AlignmentAggregatorParameter);
        }
    };
});
//# sourceMappingURL=alignment_aggregator_parameter.js.map