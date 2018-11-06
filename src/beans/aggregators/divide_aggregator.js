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
var aggregator_1 = require("./aggregator");
var any_aggregator_parameter_1 = require("./parameters/any_aggregator_parameter");
var DivideAggregator = /** @class */ (function (_super) {
    __extends(DivideAggregator, _super);
    function DivideAggregator() {
        var _this = _super.call(this, DivideAggregator.NAME) || this;
        _this.parameters = _this.parameters.concat([new any_aggregator_parameter_1.AnyAggregatorParameter("divisor", "by")]);
        return _this;
    }
    DivideAggregator.fromObject = function (object) {
        var rval = new DivideAggregator();
        rval.parameters = [any_aggregator_parameter_1.AnyAggregatorParameter.fromObject(object.parameters[0])];
        return rval;
    };
    DivideAggregator.NAME = "div";
    return DivideAggregator;
}(aggregator_1.Aggregator));
exports.DivideAggregator = DivideAggregator;
