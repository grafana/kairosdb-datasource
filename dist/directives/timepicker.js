System.register(["angular", "app/core/utils/datemath", "lodash", "moment", "../utils/rangeutil"], function (exports_1, context_1) {
    "use strict";
    var angular_1, dateMath, lodash_1, moment_1, rangeUtil, TimePickerCtrl;
    var __moduleName = context_1 && context_1.id;
    function TimePickerDirective() {
        return {
            restrict: "E",
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/timepicker.html",
            controller: TimePickerCtrl,
            bindToController: true,
            controllerAs: "ctrl",
            scope: {
                dashboard: "=",
                query: "=",
            },
        };
    }
    exports_1("TimePickerDirective", TimePickerDirective);
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (dateMath_1) {
                dateMath = dateMath_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (rangeUtil_1) {
                rangeUtil = rangeUtil_1;
            }
        ],
        execute: function () {
            TimePickerCtrl = (function () {
                function TimePickerCtrl($scope, $rootScope, timeSrv) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.timeSrv = timeSrv;
                    this.$scope.ctrl = this;
                    $scope.$parent.$watch("timeOverridden", function (newValue, oldValue) {
                        if (newValue !== undefined) {
                            if (newValue) {
                                _this.enableOverride();
                            }
                            else {
                                _this.disableOverride();
                            }
                        }
                    });
                    $rootScope.onAppEvent("closeTimepicker", this.openDropdown.bind(this), $scope);
                    this.dashboard.on("refresh", this.onRefresh.bind(this), $scope);
                    this.panel = this.dashboard.timepicker;
                    lodash_1.default.defaults(this.panel, TimePickerCtrl.defaults);
                    this.firstDayOfWeek = moment_1.default.localeData().firstDayOfWeek();
                    this.onRefresh();
                }
                TimePickerCtrl.prototype.onRefresh = function () {
                    var timeRaw = angular_1.default.copy(this.query.timeRange);
                    if (!timeRaw) {
                        timeRaw = this.timeSrv.timeRange().raw;
                    }
                    if (this.dashboard.getTimezone() !== "utc") {
                        if (moment_1.default.isMoment(timeRaw.from)) {
                            timeRaw.from.local();
                        }
                        if (moment_1.default.isMoment(timeRaw.to)) {
                            timeRaw.to.local();
                        }
                        this.isUtc = false;
                    }
                    else {
                        this.isUtc = true;
                    }
                    var fromMoment = dateMath.parse(timeRaw.from);
                    var toMoment = dateMath.parse(timeRaw.to);
                    this.rangeString = rangeUtil.describeTimeRange(timeRaw);
                    this.absolute = { fromJs: fromMoment.toDate(), toJs: toMoment.toDate() };
                    this.tooltip = this.dashboard.formatDate(fromMoment) + " <br>to<br>";
                    this.tooltip += this.dashboard.formatDate(toMoment);
                    this.timeRaw = timeRaw;
                    this.isAbsolute = moment_1.default.isMoment(this.timeRaw.to);
                };
                TimePickerCtrl.prototype.openDropdown = function () {
                    if (this.isOpen) {
                        this.closeDropdown();
                        return;
                    }
                    this.onRefresh();
                    this.editTimeRaw = this.timeRaw;
                    this.timeOptions = rangeUtil.getRelativeTimesList(this.panel, this.rangeString);
                    this.refresh = {
                        value: this.dashboard.refresh,
                        options: lodash_1.default.map(this.panel.refresh_intervals, function (interval) {
                            return { text: interval, value: interval };
                        }),
                    };
                    this.refresh.options.unshift({ text: "off" });
                    this.isOpen = true;
                    this.$rootScope.appEvent("timepickerOpen");
                };
                TimePickerCtrl.prototype.closeDropdown = function () {
                    this.isOpen = false;
                    this.onRefresh();
                    this.$rootScope.appEvent("timepickerClosed");
                };
                TimePickerCtrl.prototype.applyCustom = function () {
                    this.query.timeRange = { from: this.editTimeRaw.from, to: this.editTimeRaw.to };
                    this.closeDropdown();
                };
                TimePickerCtrl.prototype.absoluteFromChanged = function () {
                    this.editTimeRaw.from = this.getAbsoluteMomentForTimezone(this.absolute.fromJs);
                };
                TimePickerCtrl.prototype.absoluteToChanged = function () {
                    this.editTimeRaw.to = this.getAbsoluteMomentForTimezone(this.absolute.toJs);
                };
                TimePickerCtrl.prototype.getAbsoluteMomentForTimezone = function (jsDate) {
                    return this.dashboard.getTimezone() === "utc" ? moment_1.default(jsDate).utc() : moment_1.default(jsDate);
                };
                TimePickerCtrl.prototype.setRelativeFilter = function (timespan) {
                    var range = { from: timespan.from, to: timespan.to };
                    if (this.panel.nowDelay && range.to === "now") {
                        range.to = "now-" + this.panel.nowDelay;
                    }
                    this.query.timeRange = range;
                    this.closeDropdown();
                };
                TimePickerCtrl.prototype.enableOverride = function () {
                    var timeRaw = this.timeSrv.timeRange().raw;
                    this.query.timeRange = { from: timeRaw.from, to: timeRaw.to };
                    this.onRefresh();
                };
                TimePickerCtrl.prototype.disableOverride = function () {
                    this.query.timeRange = undefined;
                    this.onRefresh();
                };
                TimePickerCtrl.tooltipFormat = "MMM D, YYYY HH:mm:ss";
                TimePickerCtrl.defaults = {
                    time_options: ["5m", "15m", "1h", "6h", "12h", "24h", "2d", "7d", "30d"],
                    refresh_intervals: ["5s", "10s", "30s", "1m", "5m", "15m", "30m", "1h", "2h", "1d"],
                };
                return TimePickerCtrl;
            }());
            exports_1("TimePickerCtrl", TimePickerCtrl);
        }
    };
});
//# sourceMappingURL=timepicker.js.map