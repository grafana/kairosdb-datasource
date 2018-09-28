System.register(["../utils", "./limited_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var utils_1, limited_aggregator_parameter_1;
    var EnumAggregatorParameter;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (limited_aggregator_parameter_1_1) {
                limited_aggregator_parameter_1 = limited_aggregator_parameter_1_1;
            }],
        execute: function() {
            EnumAggregatorParameter = (function (_super) {
                __extends(EnumAggregatorParameter, _super);
                function EnumAggregatorParameter(name, type, text, value) {
                    if (text === void 0) { text = name; }
                    if (value === void 0) { value = null; }
                    _super.call(this, name, utils_1.EnumValues(type), text, value);
                    this.type = "enum";
                }
                return EnumAggregatorParameter;
            })(limited_aggregator_parameter_1.LimitedAggregatorParameter);
            exports_1("EnumAggregatorParameter", EnumAggregatorParameter);
        }
    }
});
//# sourceMappingURL=enum_aggregator_parameter.js.map