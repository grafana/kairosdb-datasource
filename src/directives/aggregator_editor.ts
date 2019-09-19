import _ from "lodash";
import {fromObject} from "../beans/aggregators/aggregators";

function AggregatorEditorLink(scope) {
    scope.newAggregator = null;
    scope.pickAggregator = (aggregatorName) => {
        if (aggregatorName) {
            scope.newAggregator = fromObject(_.find(scope.ctrl.availableAggregators, (e) => e.name === aggregatorName));
        }
    };

    scope.isAutoValue = () => {
        return !_.isNil(scope.newAggregator.autoValueSwitch) && scope.newAggregator.autoValueSwitch.enabled;
    };
}

export function AggregatorEditorDirective() {
    return {
        link: AggregatorEditorLink,
        restrict: "E",
        scope: false,
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/aggregator.editor.html"
    };
}
