System.register(["./aggregator", "./parameters/any_aggregator_parameter", "./parameters/enum_aggregator_parameter", "./utils"], function (exports_1, context_1) {
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
    var aggregator_1, any_aggregator_parameter_1, enum_aggregator_parameter_1, utils_1, FilterAggregator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (any_aggregator_parameter_1_1) {
                any_aggregator_parameter_1 = any_aggregator_parameter_1_1;
            },
            function (enum_aggregator_parameter_1_1) {
                enum_aggregator_parameter_1 = enum_aggregator_parameter_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            FilterAggregator = (function (_super) {
                __extends(FilterAggregator, _super);
                function FilterAggregator() {
                    var _this = _super.call(this, FilterAggregator.NAME) || this;
                    _this.parameters = _this.parameters.concat([
                        new enum_aggregator_parameter_1.EnumAggregatorParameter("filter_op", utils_1.Filter, "filter"),
                        new any_aggregator_parameter_1.AnyAggregatorParameter("threshold", "threshold"),
                        new enum_aggregator_parameter_1.EnumAggregatorParameter("filter_indeterminate_inclusion", utils_1.Indeterminate, "if uncertain", utils_1.Indeterminate[utils_1.Indeterminate.keep])
                    ]);
                    return _this;
                }
                FilterAggregator.fromObject = function (object) {
                    var rval = new FilterAggregator();
                    rval.parameters = [
                        enum_aggregator_parameter_1.EnumAggregatorParameter.fromObject(object.parameters[0]),
                        any_aggregator_parameter_1.AnyAggregatorParameter.fromObject(object.parameters[1]),
                        enum_aggregator_parameter_1.EnumAggregatorParameter.fromObject(object.parameters[2])
                    ];
                    return rval;
                };
                FilterAggregator.NAME = "filter";
                return FilterAggregator;
            }(aggregator_1.Aggregator));
            exports_1("FilterAggregator", FilterAggregator);
        }
    };
});
//# sourceMappingURL=filter_aggregator.js.map