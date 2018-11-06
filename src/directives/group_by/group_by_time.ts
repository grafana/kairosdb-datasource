import _ from "lodash";
import {EnumValues, TimeUnit} from "../../beans/aggregators/utils";
import {GroupByTimeEntry} from "../../directives/group_by/group_by_time_entry";

export class GroupByTimeCtrl {
    public entries: GroupByTimeEntry[];
    public inputVisible: boolean = false;
    public allowedUnitValues: string[] = EnumValues(TimeUnit);

    constructor() {
        this.entries = this.entries || [];
    }

    public add(entry: any): void {
        if (this.isValidEntry(entry)) {
            this.entries.push(
              new GroupByTimeEntry(entry.interval, entry.unit, entry.count));
        }
        this.inputVisible = !this.inputVisible;
    }

    public remove(entry): void {
        this.entries = _.without(this.entries, entry);
    }

    private isValidEntry(entry): boolean {
        return !isNaN(entry.interval) && !isNaN(entry.count);
    }
}

export function GroupByTimeDirective() {
    return {
        bindToController: true,
        controller: GroupByTimeCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            entries: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/group.by.time.html"
    };
}
