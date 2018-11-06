System.register(["./aggregator_parameter"], function (exports_1, context_1) {
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
    var aggregator_parameter_1, LimitedAggregatorParameter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aggregator_parameter_1_1) {
                aggregator_parameter_1 = aggregator_parameter_1_1;
            }
        ],
        execute: function () {
            LimitedAggregatorParameter = (function (_super) {
                __extends(LimitedAggregatorParameter, _super);
                function LimitedAggregatorParameter(name, allowedValues, text, value) {
                    if (text === void 0) { text = name; }
                    if (value === void 0) { value = null; }
                    var _this = _super.call(this, name, text, value) || this;
                    _this.allowedValues = allowedValues;
                    _this.type = "limited";
                    return _this;
                }
                return LimitedAggregatorParameter;
            }(aggregator_parameter_1.AggregatorParameter));
            exports_1("LimitedAggregatorParameter", LimitedAggregatorParameter);
        }
    };
});
//# sourceMappingURL=limited_aggregator_parameter.js.map