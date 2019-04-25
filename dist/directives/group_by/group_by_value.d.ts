export declare class GroupByValueCtrl {
    entries: string[];
    inputVisible: boolean;
    add(value: any): void;
    remove(entry: any): void;
}
export declare function GroupByValueDirective(): {
    bindToController: boolean;
    controller: typeof GroupByValueCtrl;
    controllerAs: string;
    restrict: string;
    scope: {
        entries: string;
    };
    templateUrl: string;
};
