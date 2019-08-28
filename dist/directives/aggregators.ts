import _ from "lodash";
import {Aggregator} from "../beans/aggregators/aggregator";
import "./aggregator_editor";

export class AggregatorsCtrl {
    public entries: Aggregator[];
    public availableAggregators: Aggregator[];

    public add(entry): void {
        this.entries.push(entry);
    }

    public remove(entry): void {
        this.entries = _.without(this.entries, entry);
    }

    public up(entry): void {
        const oldIdx = this.entries.indexOf(entry);
        const newIdx = oldIdx - 1;
        const currentVal = this.entries[newIdx];
        this.entries[newIdx] = entry;
        this.entries[oldIdx] = currentVal;
    }

    public down(entry): void {
        const oldIdx = this.entries.indexOf(entry);
        const newIdx = oldIdx + 1;
        const currentVal = this.entries[newIdx];
        this.entries[newIdx] = entry;
        this.entries[oldIdx] = currentVal;
    }
}

export function AggregatorsDirective() {
    return {
        bindToController: true,
        controller: AggregatorsCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            availableAggregators: "=",
            entries: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/aggregators.html"
    };
}
