import _ from "lodash";

function AggregatorEditorLink(scope) {
    scope.newAggregator = null;
    scope.pickAggregator = (aggregatorName) => {
        scope.newAggregator = _.cloneDeep(_.values(_.pickBy(
            scope.ctrl.availableAggregators, {name: aggregatorName}))[0]);
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
