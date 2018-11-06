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
var aggregator_parameter_1 = require("./aggregator_parameter");
var AnyAggregatorParameter = /** @class */ (function (_super) {
    __extends(AnyAggregatorParameter, _super);
    function AnyAggregatorParameter(name, text, value) {
        if (text === void 0) { text = name; }
        if (value === void 0) { value = null; }
        var _this = _super.call(this, name, text, value) || this;
        _this.type = "any";
        return _this;
    }
    AnyAggregatorParameter.fromObject = function (object) {
        return new AnyAggregatorParameter(object.name, object.text, object.value);
    };
    return AnyAggregatorParameter;
}(aggregator_parameter_1.AggregatorParameter));
exports.AnyAggregatorParameter = AnyAggregatorParameter;
