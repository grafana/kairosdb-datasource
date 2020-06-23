System.register(["app/plugins/sdk", "../beans/aggregators/aggregators", "../beans/request/legacy_target_converter", "../beans/request/metric_tags", "../beans/request/target", "../css/plugin.css!", "../directives/aggregators", "../directives/group_by/group_by_tags", "../directives/group_by/group_by_time", "../directives/group_by/group_by_value", "../directives/metric_name_field", "../directives/tags_select", "./request/target_validator"], function (exports_1, context_1) {
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
    var sdk_1, aggregators_1, legacy_target_converter_1, metric_tags_1, target_1, target_validator_1, KairosDBQueryCtrl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (aggregators_1_1) {
                aggregators_1 = aggregators_1_1;
            },
            function (legacy_target_converter_1_1) {
                legacy_target_converter_1 = legacy_target_converter_1_1;
            },
            function (metric_tags_1_1) {
                metric_tags_1 = metric_tags_1_1;
            },
            function (target_1_1) {
                target_1 = target_1_1;
            },
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (_6) {
            },
            function (_7) {
            },
            function (target_validator_1_1) {
                target_validator_1 = target_validator_1_1;
            }
        ],
        execute: function () {
            KairosDBQueryCtrl = (function (_super) {
                __extends(KairosDBQueryCtrl, _super);
                function KairosDBQueryCtrl($scope, $injector) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.aggregators = aggregators_1.AGGREGATORS;
                    _this.tagsInitializationError = undefined;
                    _this.targetValidator = new target_validator_1.TargetValidator(_this.datasource.enforceScalarSetting);
                    _this.legacyTargetConverter = new legacy_target_converter_1.LegacyTargetConverter();
                    _this.datasource.initialize().then(function () { return $scope.$apply(); });
                    $scope.$watch("ctrl.target.query", _this.onTargetChange.bind(_this), true);
                    $scope.$watch("ctrl.target.query.metricName", _this.onMetricNameChanged.bind(_this));
                    if (_this.legacyTargetConverter.isApplicable(_this.target)) {
                        _this.target.query = _this.legacyTargetConverter.convert(_this.target);
                    }
                    if (_this.target.query && !(_this.target.query instanceof target_1.KairosDBTarget)) {
                        _this.target.query = target_1.KairosDBTarget.fromObject(_this.target.query);
                    }
                    else {
                        _this.target.query = _this.target.query || new target_1.KairosDBTarget();
                    }
                    _this.initializeTags(_this.target.query.metricName, _this.target.query, $scope);
                    return _this;
                }
                KairosDBQueryCtrl.prototype.getCollapsedText = function () {
                    return this.target.query.asString();
                };
                KairosDBQueryCtrl.prototype.onTargetChange = function (newTarget, oldTarget) {
                    if (this.isTargetChanged(newTarget, oldTarget) && this.targetValidator.isValidTarget(newTarget)) {
                        this.refresh();
                    }
                };
                KairosDBQueryCtrl.prototype.onMetricNameChanged = function (newMetricName, oldMetricName, $scope) {
                    if (newMetricName === oldMetricName) {
                        return;
                    }
                    var query = this.buildNewTarget(newMetricName);
                    this.initializeTags(newMetricName, query, $scope);
                    this.target.query = query;
                };
                KairosDBQueryCtrl.prototype.buildNewTarget = function (metricName) {
                    var oldQuery = this.target.query;
                    var target = new target_1.KairosDBTarget();
                    target.metricName = metricName;
                    if (oldQuery) {
                        target.aggregators = oldQuery.aggregators;
                        target.alias = oldQuery.alias;
                        target.tags = oldQuery.tags;
                        target.groupBy = oldQuery.groupBy;
                        target.timeRange = oldQuery.timeRange;
                        target.overrideScalar = oldQuery.overrideScalar;
                    }
                    return target;
                };
                KairosDBQueryCtrl.prototype.initializeTags = function (metricName, query, $scope) {
                    var _this = this;
                    this.clear();
                    if (metricName) {
                        this.tags = new metric_tags_1.MetricTags();
                        this.datasource.getMetricTags(metricName)
                            .then(function (tags) { return $scope.$apply(function () { return _this.tags.updateTags(tags); }); }, function (error) { return _this.tagsInitializationError = error.data.message; })
                            .then(function () {
                            if (!_this.tagsInitializationError) {
                                var newTags_1 = {};
                                Object.keys(query.tags)
                                    .filter(function (tag) { return _this.tags.tags.hasOwnProperty(tag); })
                                    .forEach(function (tag) {
                                    newTags_1[tag] = query.tags[tag]
                                        .filter(function (value) { return _this.tags.tags[tag].indexOf(value) > -1
                                        || value.charAt(0) === "$"
                                        || (value.charAt(0) === "[" && value.charAt(value.length - 1) === "]"); });
                                });
                                Object.keys(_this.tags.tags)
                                    .filter(function (tag) { return !query.tags.hasOwnProperty(tag); })
                                    .forEach(function (tag) { return newTags_1[tag] = []; });
                                query.tags = newTags_1;
                                if (query.groupBy.tags) {
                                    query.groupBy.tags = query.groupBy.tags.filter(function (tag) { return _this.tags.tags.hasOwnProperty(tag); });
                                }
                            }
                        });
                    }
                };
                KairosDBQueryCtrl.prototype.isTargetChanged = function (newTarget, oldTarget) {
                    return JSON.stringify(newTarget) !== JSON.stringify(oldTarget);
                };
                KairosDBQueryCtrl.prototype.clear = function () {
                    this.tagsInitializationError = undefined;
                };
                KairosDBQueryCtrl.templateUrl = "partials/query.editor.html";
                return KairosDBQueryCtrl;
            }(sdk_1.QueryCtrl));
            exports_1("KairosDBQueryCtrl", KairosDBQueryCtrl);
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map