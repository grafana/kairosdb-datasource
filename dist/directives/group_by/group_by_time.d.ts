import { GroupByTimeEntry } from "../../directives/group_by/group_by_time_entry";
export declare class GroupByTimeCtrl {
    entries: GroupByTimeEntry[];
    inputVisible: boolean;
    allowedUnitValues: string[];
    constructor();
    add(entry: any): void;
    remove(entry: any): void;
    private isValidEntry;
}
export declare function GroupByTimeDirective(): {
    bindToController: boolean;
    controller: typeof GroupByTimeCtrl;
    controllerAs: string;
    restrict: string;
    scope: {
        entries: string;
    };
    templateUrl: string;
};
