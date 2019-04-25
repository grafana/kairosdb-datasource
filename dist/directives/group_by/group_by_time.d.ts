import { GroupByTimeEntry } from "group_by_time_entry";
export declare class GroupByTimeCtrl {
    entries: GroupByTimeEntry[];
    inputVisible: boolean;
    allowedUnitValues: string[];
    constructor();
    add(entry: any): void;
    remove(entry: any): void;
    private isValidEntry(entry);
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
