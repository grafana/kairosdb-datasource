System.register(["../utils", "./limited_aggregator_parameter"], function (exports_1, context_1) {
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
    var utils_1, limited_aggregator_parameter_1, EnumAggregatorParameter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (limited_aggregator_parameter_1_1) {
                limited_aggregator_parameter_1 = limited_aggregator_parameter_1_1;
            }
        ],
        execute: function () {
            EnumAggregatorParameter = (function (_super) {
                __extends(EnumAggregatorParameter, _super);
                function EnumAggregatorParameter(name, enumType, text, value) {
                    if (text === void 0) { text = name; }
                    if (value === void 0) { value = null; }
                    var _this = _super.call(this, name, utils_1.EnumValues(enumType), text, value) || this;
                    _this.type = "enum";
                    return _this;
                }
                EnumAggregatorParameter.fromObject = function (object) {
                    return new EnumAggregatorParameter(object.name, object.allowedValues, object.text, object.value);
                };
                return EnumAggregatorParameter;
            }(limited_aggregator_parameter_1.LimitedAggregatorParameter));
            exports_1("EnumAggregatorParameter", EnumAggregatorParameter);
        }
    };
});
//# sourceMappingURL=enum_aggregator_parameter.js.map