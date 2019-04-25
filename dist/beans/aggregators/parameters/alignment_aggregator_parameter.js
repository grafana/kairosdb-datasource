System.register(["../utils", "./enum_aggregator_parameter"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var utils_1, enum_aggregator_parameter_1;
    var AlignmentAggregatorParameter;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (enum_aggregator_parameter_1_1) {
                enum_aggregator_parameter_1 = enum_aggregator_parameter_1_1;
            }],
        execute: function() {
            AlignmentAggregatorParameter = (function (_super) {
                __extends(AlignmentAggregatorParameter, _super);
                function AlignmentAggregatorParameter() {
                    _super.call(this, "sampling", utils_1.Alignment, "align by", "NONE");
                    this.type = "alignment";
                }
                return AlignmentAggregatorParameter;
            })(enum_aggregator_parameter_1.EnumAggregatorParameter);
            exports_1("AlignmentAggregatorParameter", AlignmentAggregatorParameter);
        }
    }
});
//# sourceMappingURL=alignment_aggregator_parameter.js.map