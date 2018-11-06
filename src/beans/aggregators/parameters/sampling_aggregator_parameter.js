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
var any_aggregator_parameter_1 = require("./any_aggregator_parameter");
var SamplingAggregatorParameter = /** @class */ (function (_super) {
    __extends(SamplingAggregatorParameter, _super);
    function SamplingAggregatorParameter(text, value) {
        if (text === void 0) { text = name; }
        if (value === void 0) { value = null; }
        var _this = _super.call(this, "value", text, value) || this;
        _this.type = SamplingAggregatorParameter.TYPE;
        return _this;
    }
    SamplingAggregatorParameter.fromObject = function (object) {
        return new SamplingAggregatorParameter(object.text, object.value);
    };
    SamplingAggregatorParameter.TYPE = "sampling";
    return SamplingAggregatorParameter;
}(any_aggregator_parameter_1.AnyAggregatorParameter));
exports.SamplingAggregatorParameter = SamplingAggregatorParameter;
