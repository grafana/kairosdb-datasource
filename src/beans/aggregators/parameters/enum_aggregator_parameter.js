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
var utils_1 = require("../utils");
var limited_aggregator_parameter_1 = require("./limited_aggregator_parameter");
var EnumAggregatorParameter = /** @class */ (function (_super) {
    __extends(EnumAggregatorParameter, _super);
    function EnumAggregatorParameter(name, type, text, value) {
        if (text === void 0) { text = name; }
        if (value === void 0) { value = null; }
        var _this = _super.call(this, name, utils_1.EnumValues(type), text, value) || this;
        _this.type = "enum";
        return _this;
    }
    EnumAggregatorParameter.fromObject = function (object) {
        return new EnumAggregatorParameter(object.name, object.type, object.text, object.value);
    };
    return EnumAggregatorParameter;
}(limited_aggregator_parameter_1.LimitedAggregatorParameter));
exports.EnumAggregatorParameter = EnumAggregatorParameter;
