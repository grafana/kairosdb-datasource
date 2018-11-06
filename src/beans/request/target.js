"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Aggregators = require("../aggregators/aggregators");
var group_by_1 = require("./group_by");
var KairosDBTarget = /** @class */ (function () {
    function KairosDBTarget() {
        this.metricName = undefined;
        this.alias = undefined;
        this.tags = {};
        this.groupBy = new group_by_1.GroupBy();
        this.aggregators = [];
    }
    KairosDBTarget.fromObject = function (object) {
        var rval = new KairosDBTarget();
        rval.metricName = object.metricName;
        rval.alias = object.alias;
        rval.tags = object.tags || {};
        rval.groupBy = group_by_1.GroupBy.fromObject(object.groupBy);
        rval.aggregators = (object.aggregators || []).map(function (val) { return Aggregators.fromObject(val); });
        return rval;
    };
    KairosDBTarget.prototype.asString = function () {
        var _this = this;
        var str = "SELECT ";
        if (this.aggregators.length > 0) {
            this.aggregators.slice().reverse().forEach(function (agg) {
                str += agg.name + "(";
            });
            this.aggregators.forEach(function (agg, aggIndex) {
                if (aggIndex === 0) {
                    str += "*";
                }
                agg.parameters.filter(function (param) {
                    return param.type === "any" || param.type === "enum";
                })
                    .forEach(function (param, index) {
                    if (aggIndex === 0 || index !== 0) {
                        str += ", ";
                    }
                    str += param.value;
                });
                str += ")";
            });
        }
        else {
            str += "*";
        }
        if (this.alias) {
            str += " as " + this.alias;
        }
        str += " FROM " + this.metricName;
        if (Object.keys(this.tags).length > 0) {
            var filteredKeys = Object.keys(this.tags).filter(function (key) {
                return !(_this.tags[key] === undefined || _this.tags[key].length === 0);
            });
            if (filteredKeys.length > 0) {
                str += " WHERE ";
                filteredKeys.forEach(function (key, index) {
                    if (index !== 0) {
                        str += ", ";
                    }
                    var value = _this.tags[key];
                    if (value.length > 1) {
                        str += key + "=[" + value.join(",") + "]";
                    }
                    else {
                        str += key + "=" + value[0];
                    }
                });
            }
        }
        str += this.groupBy.asString();
        return str;
    };
    return KairosDBTarget;
}());
exports.KairosDBTarget = KairosDBTarget;
