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
var enum_aggregator_parameter_1 = require("./enum_aggregator_parameter");
var AlignmentAggregatorParameter = /** @class */ (function (_super) {
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
exports.AlignmentAggregatorParameter = AlignmentAggregatorParameter;
