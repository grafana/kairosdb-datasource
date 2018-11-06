System.register(["./aggregator", "./parameters/enum_aggregator_parameter", "./utils"], function (exports_1, context_1) {
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
    var aggregator_1, enum_aggregator_parameter_1, utils_1, TrimAggregator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (enum_aggregator_parameter_1_1) {
                enum_aggregator_parameter_1 = enum_aggregator_parameter_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            TrimAggregator = (function (_super) {
                __extends(TrimAggregator, _super);
                function TrimAggregator() {
                    var _this = _super.call(this, TrimAggregator.NAME) || this;
                    _this.parameters = _this.parameters.concat([new enum_aggregator_parameter_1.EnumAggregatorParameter("trim", utils_1.Trim, "by")]);
                    return _this;
                }
                TrimAggregator.fromObject = function (object) {
                    var rval = new TrimAggregator();
                    rval.parameters = [enum_aggregator_parameter_1.EnumAggregatorParameter.fromObject(object.parameters[0])];
                    return rval;
                };
                TrimAggregator.NAME = "trim";
                return TrimAggregator;
            }(aggregator_1.Aggregator));
            exports_1("TrimAggregator", TrimAggregator);
        }
    };
});
//# sourceMappingURL=trim_aggregator.js.map