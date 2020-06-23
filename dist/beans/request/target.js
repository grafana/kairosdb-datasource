System.register(["app/core/utils/datemath", "../aggregators/aggregators", "./group_by"], function (exports_1, context_1) {
    "use strict";
    var dateMath, Aggregators, group_by_1, KairosDBTarget;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (dateMath_1) {
                dateMath = dateMath_1;
            },
            function (Aggregators_1) {
                Aggregators = Aggregators_1;
            },
            function (group_by_1_1) {
                group_by_1 = group_by_1_1;
            }
        ],
        execute: function () {
            KairosDBTarget = (function () {
                function KairosDBTarget() {
                    this.metricName = undefined;
                    this.alias = undefined;
                    this.tags = {};
                    this.groupBy = new group_by_1.GroupBy();
                    this.aggregators = [];
                    this.overrideScalar = undefined;
                }
                KairosDBTarget.fromObject = function (object) {
                    var rval = new KairosDBTarget();
                    if (object) {
                        rval.metricName = object.metricName;
                        rval.alias = object.alias;
                        rval.tags = object.tags || {};
                        rval.groupBy = group_by_1.GroupBy.fromObject(object.groupBy);
                        rval.aggregators = (object.aggregators || []).map(function (val) { return Aggregators.fromObject(val); });
                        rval.timeRange = object.timeRange;
                        rval.overrideScalar = object.overrideScalar;
                    }
                    return rval;
                };
                KairosDBTarget.prototype.startTime = function () {
                    if (this.timeRange) {
                        var startMoment = dateMath.parse(this.timeRange.from);
                        if (startMoment) {
                            return startMoment.unix() * 1000;
                        }
                    }
                    return undefined;
                };
                KairosDBTarget.prototype.endTime = function () {
                    if (this.timeRange) {
                        var endMoment = dateMath.parse(this.timeRange.to);
                        if (endMoment) {
                            return endMoment.unix() * 1000;
                        }
                    }
                    return undefined;
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
            exports_1("KairosDBTarget", KairosDBTarget);
        }
    };
});
//# sourceMappingURL=target.js.map