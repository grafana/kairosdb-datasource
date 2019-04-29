import angular from "angular";
import * as dateMath from "app/core/utils/datemath";
import _ from "lodash";
import moment from "moment";

import {KairosDBTarget} from "../beans/request/target";
import * as rangeUtil from "../utils/rangeutil";

export class TimePickerCtrl {
  public static tooltipFormat = "MMM D, YYYY HH:mm:ss";
  public static defaults = {
    time_options: ["5m", "15m", "1h", "6h", "12h", "24h", "2d", "7d", "30d"],
    refresh_intervals: ["5s", "10s", "30s", "1m", "5m", "15m", "30m", "1h", "2h", "1d"],
  };

  public dashboard: any;
  public query: KairosDBTarget;
  public panel: any;
  public absolute: any;
  public timeRaw: any;
  public editTimeRaw: any;
  public tooltip: string;
  public rangeString: string;
  public timeOptions: any;
  public refresh: any;
  public isUtc: boolean;
  public firstDayOfWeek: number;
  public isOpen: boolean;
  public isAbsolute: boolean;

  /** @ngInject */
  constructor(private $scope, private $rootScope, private timeSrv) {
    this.$scope.ctrl = this;

    $scope.$parent.$watch("timeOverridden", (newValue, oldValue) => {
      if (newValue !== undefined) {
          if (newValue) {
              this.enableOverride();
          } else {
              this.disableOverride();
          }
      }
    });

    $rootScope.onAppEvent("closeTimepicker", this.openDropdown.bind(this), $scope);

    this.dashboard.on("refresh", this.onRefresh.bind(this), $scope);

    // init options
    this.panel = this.dashboard.timepicker;
    _.defaults(this.panel, TimePickerCtrl.defaults);
    this.firstDayOfWeek = moment.localeData().firstDayOfWeek();

    // init time stuff
    this.onRefresh();
  }

  public onRefresh() {
    let timeRaw = angular.copy(this.query.timeRange);

    if (!timeRaw) {
      timeRaw = this.timeSrv.timeRange().raw;
    }

    if (!this.dashboard.isTimezoneUtc()) {
      if (moment.isMoment(timeRaw.from)) {
        timeRaw.from.local();
      }
      if (moment.isMoment(timeRaw.to)) {
        timeRaw.to.local();
      }
      this.isUtc = false;
    } else {
      this.isUtc = true;
    }

    const fromMoment = dateMath.parse(timeRaw.from);
    const toMoment = dateMath.parse(timeRaw.to);

    this.rangeString = rangeUtil.describeTimeRange(timeRaw);
    this.absolute = { fromJs: fromMoment.toDate(), toJs: toMoment.toDate() };
    this.tooltip = this.dashboard.formatDate(fromMoment) + " <br>to<br>";
    this.tooltip += this.dashboard.formatDate(toMoment);
    this.timeRaw = timeRaw;
    this.isAbsolute = moment.isMoment(this.timeRaw.to);
  }

  public openDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
      return;
    }

    this.onRefresh();
    this.editTimeRaw = this.timeRaw;
    this.timeOptions = rangeUtil.getRelativeTimesList(this.panel, this.rangeString);
    this.refresh = {
      value: this.dashboard.refresh,
      options: _.map(this.panel.refresh_intervals, (interval: any) => {
        return { text: interval, value: interval };
      }),
    };

    this.refresh.options.unshift({ text: "off" });
    this.isOpen = true;
    this.$rootScope.appEvent("timepickerOpen");
  }

  public closeDropdown() {
    this.isOpen = false;
    this.onRefresh();
    this.$rootScope.appEvent("timepickerClosed");
  }

  public applyCustom() {
    this.query.timeRange = {from: this.editTimeRaw.from, to: this.editTimeRaw.to};
    this.closeDropdown();
  }

  public absoluteFromChanged() {
    this.editTimeRaw.from = this.getAbsoluteMomentForTimezone(this.absolute.fromJs);
  }

  public absoluteToChanged() {
    this.editTimeRaw.to = this.getAbsoluteMomentForTimezone(this.absolute.toJs);
  }

  public getAbsoluteMomentForTimezone(jsDate) {
    return this.dashboard.isTimezoneUtc() ? moment(jsDate).utc() : moment(jsDate);
  }

  public setRelativeFilter(timespan) {
    const range = { from: timespan.from, to: timespan.to };

    if (this.panel.nowDelay && range.to === "now") {
      range.to = "now-" + this.panel.nowDelay;
    }

    this.query.timeRange = range;
    this.closeDropdown();
  }

  public enableOverride() {
    const timeRaw = this.timeSrv.timeRange().raw;
    this.query.timeRange = {from: timeRaw.from, to: timeRaw.to};
    this.onRefresh();
  }

  public disableOverride() {
    this.query.timeRange = undefined;
    this.onRefresh();
  }
}

export function TimePickerDirective() {
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
