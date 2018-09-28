import _ from "lodash";
import {Aggregator} from "../beans/aggregators/aggregator";
import {AggregatorParameter} from "../beans/aggregators/parameters/aggregator_parameter";
import "./aggregator_editor";

export class AggregatorCtrl {
    public value: Aggregator;
    public visibleParameters: AggregatorParameter[];
    public isAutoValue: boolean = false;

    constructor() {
        this.isAutoValue = !_.isNil(this.value.autoValueSwitch) && this.value.autoValueSwitch.enabled;
        this.visibleParameters = this.isAutoValue ? this.getVisibleParameters() : this.value.parameters;
    }

    private getVisibleParameters(): AggregatorParameter[] {
        const dependentParametersTypes =
            this.value.autoValueSwitch.dependentParameters.map((parameter) => parameter.type);
        return this.value.parameters.filter((parameter) => !_.includes(dependentParametersTypes, parameter.type));
    }
}

export function AggregatorDirective() {
    return {
        bindToController: true,
        controller: AggregatorCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            onRemove: "&",
            value: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/aggregator.html"
    };
}
