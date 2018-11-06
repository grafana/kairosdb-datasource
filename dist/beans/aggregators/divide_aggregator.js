System.register(["./aggregator", "./parameters/any_aggregator_parameter"], function (exports_1, context_1) {
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
    var aggregator_1, any_aggregator_parameter_1, DivideAggregator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            }
        ],
        execute: function () {
            DivideAggregator = (function (_super) {
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
            exports_1("DivideAggregator", DivideAggregator);
        }
    };
});
//# sourceMappingURL=divide_aggregator.js.map