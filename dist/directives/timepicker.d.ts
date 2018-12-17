import { KairosDBTarget } from "../beans/request/target";
export declare class TimePickerCtrl {
    private $scope;
    private $rootScope;
    private timeSrv;
    static tooltipFormat: string;
    static defaults: {
        time_options: string[];
        refresh_intervals: string[];
    };
    dashboard: any;
    query: KairosDBTarget;
    panel: any;
    absolute: any;
    timeRaw: any;
    editTimeRaw: any;
    tooltip: string;
    rangeString: string;
    timeOptions: any;
    refresh: any;
    isUtc: boolean;
    firstDayOfWeek: number;
    isOpen: boolean;
    isAbsolute: boolean;
    constructor($scope: any, $rootScope: any, timeSrv: any);
    onRefresh(): void;
    openDropdown(): void;
    closeDropdown(): void;
    absoluteFromChanged(): void;
    absoluteToChanged(): void;
    getAbsoluteMomentForTimezone(jsDate: any): any;
    setRelativeFilter(timespan: any): void;
    enableOverride(): void;
    disableOverride(): void;
}
export declare function TimePickerDirective(): {
    restrict: string;
    templateUrl: string;
    controller: typeof TimePickerCtrl;
    bindToController: boolean;
    controllerAs: string;
    scope: {
        dashboard: string;
        query: string;
    };
};
