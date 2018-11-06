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
    var aggregator_parameter_1, AnyAggregatorParameter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aggregator_parameter_1_1) {
                aggregator_parameter_1 = aggregator_parameter_1_1;
            }
        ],
        execute: function () {
            AnyAggregatorParameter = (function (_super) {
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
            exports_1("AnyAggregatorParameter", AnyAggregatorParameter);
        }
    };
});
//# sourceMappingURL=any_aggregator_parameter.js.map