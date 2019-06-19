System.register(["app/plugins/sdk", "../beans/aggregators/aggregators", "../beans/request/legacy_target_converter", "../beans/request/metric_tags", "../beans/request/target", "../css/plugin.css!", "../directives/aggregators", "../directives/group_by/group_by_tags", "../directives/group_by/group_by_time", "../directives/group_by/group_by_value", "../directives/metric_name_field", "../directives/tags_select", "./request/target_validator"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sdk_1, aggregators_1, legacy_target_converter_1, metric_tags_1, target_1, target_validator_1;
    var KairosDBQueryCtrl;
    return {
        setters:[
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
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (_4) {},
            function (_5) {},
            function (_6) {},
            function (_7) {},
            function (target_validator_1_1) {
                target_validator_1 = target_validator_1_1;
            }],
        execute: function() {
            KairosDBQueryCtrl = (function (_super) {
                __extends(KairosDBQueryCtrl, _super);
                /** @ngInject **/
                function KairosDBQueryCtrl($scope, $injector) {
                    _super.call(this, $scope, $injector);
                    this.aggregators = aggregators_1.AGGREGATORS;
                    this.tagsInitializationError = undefined;
                    this.customTagName = "";
                    this.targetValidator = new target_validator_1.TargetValidator();
                    this.legacyTargetConverter = new legacy_target_converter_1.LegacyTargetConverter();
                    this.datasource.initialize();
                    $scope.$watch("ctrl.target.query", this.onTargetChange.bind(this), true);
                    $scope.$watch("ctrl.tags.tags", this.onTagsChange.bind(this), true);
                    $scope.$watch("ctrl.target.query.metricName", this.onMetricNameChanged.bind(this));
                    if (this.legacyTargetConverter.isApplicable(this.target)) {
                        this.target.query = this.legacyTargetConverter.convert(this.target);
                    }
                    this.target.query = this.target.query || new target_1.KairosDBTarget();
                    this.initializeTags(this.target.query.metricName);
                }
                KairosDBQueryCtrl.prototype.onTargetChange = function (newTarget, oldTarget) {
                    if (this.isTargetChanged(newTarget, oldTarget) && this.targetValidator.isValidTarget(newTarget)) {
                        this.refresh();
                    }
                };
                KairosDBQueryCtrl.prototype.onMetricNameChanged = function (newMetricName, oldMetricName) {
                    if (newMetricName === oldMetricName) {
                        return;
                    }
                    this.target.query = this.buildNewTarget(newMetricName);
                    this.initializeTags(newMetricName);
                };
                KairosDBQueryCtrl.prototype.onTagsChange = function (newTags, oldTags) {
                    this.tags.updateTags(newTags);
                };
                KairosDBQueryCtrl.prototype.buildNewTarget = function (metricName) {
                    var target = new target_1.KairosDBTarget();
                    target.metricName = metricName;
                    return target;
                };
                KairosDBQueryCtrl.prototype.initializeTags = function (metricName) {
                    var _this = this;
                    this.clear();
                    if (metricName) {
                        this.tags = new metric_tags_1.MetricTags();
                        this.datasource.getMetricTags(metricName)
                            .then(function (tags) {
                            Object.keys(_this.target.query.tags).map(function (key) {
                                tags[key] = tags[key] || [];
                            });
                            _this.tags.updateTags(tags);
                        }, function (error) {
                            if (error && error.data && error.data.message) {
                                _this.tagsInitializationError = error.data.message;
                            }
                            else if (error.cancelled) {
                                _this.tagsInitializationError = "Query was cancelled";
                            }
                            else {
                                _this.tagsInitializationError = "Unknown error";
                            }
                            _this.tags.updateTags(_this.target.query.tags);
                        });
                    }
                };
                KairosDBQueryCtrl.prototype.isTargetChanged = function (newTarget, oldTarget) {
                    return JSON.stringify(newTarget) !== JSON.stringify(oldTarget);
                };
                KairosDBQueryCtrl.prototype.clear = function () {
                    this.tagsInitializationError = undefined;
                };
                KairosDBQueryCtrl.prototype.addCustomTag = function () {
                    var tags = this.tags.tags;
                    if (!tags[this.customTagName]) {
                        tags[this.customTagName] = [];
                        this.tags.updateTags(tags);
                    }
                    this.customTagName = "";
                };
                KairosDBQueryCtrl.templateUrl = "partials/query.editor.html";
                return KairosDBQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("KairosDBQueryCtrl", KairosDBQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map