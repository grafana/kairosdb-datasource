import _ from "lodash";
import {PromiseUtils} from "../utils/promise_utils";

const METRIC_NAMES_SUGGESTIONS_LIMIT = 20;

export class MetricNameFieldCtrl {
    public value: string;
    public metricNames: string[];
    public alias: string;
    public segment: any;
    public aliasInputVisible: boolean = false;
    public aliasAddedVisible: boolean = false;
    private $q: any;
    private $scope: any;
    private promiseUtils: PromiseUtils;

    /** @ngInject **/
    constructor($scope, $q, private uiSegmentSrv) {
        this.$scope = $scope;
        this.$q = $q;
        this.uiSegmentSrv = uiSegmentSrv;
        this.promiseUtils = new PromiseUtils($q);
        this.segment = this.value ? uiSegmentSrv.newSegment(this.value) : uiSegmentSrv.newSelectMetric();
        this.aliasAddedVisible = !_.isNil(this.alias);
    }

    public onChange(segment): void {
        this.value = this.$scope.getMetricInputValue();
    }

    public suggestMetrics(): string[] {
        const query = this.$scope.getMetricInputValue();
        return this.promiseUtils.resolvedPromise(this.metricNames
            .filter((metricName) => _.includes(metricName, query))
            .slice(0, METRIC_NAMES_SUGGESTIONS_LIMIT)
            .map((metricName) => {
                return this.uiSegmentSrv.newSegment(metricName);
            }));
    }

    public setAlias(alias): void {
        if (!_.isEmpty(alias)) {
            this.alias = alias;
            this.aliasAddedVisible = true;
        }
        this.aliasInputVisible = false;
    }
}

export class MetricNameFieldLink {
    constructor(scope, element) {
        scope.getMetricInputValue = () => {
            return element[0].getElementsByTagName("input")[0].value;
        };
    }
}

export function MetricNameFieldDirective() {
    return {
        bindToController: true,
        controller: MetricNameFieldCtrl,
        controllerAs: "ctrl",
        link: MetricNameFieldLink,
        restrict: "E",
        scope: {
            alias: "=",
            metricNames: "=",
            value: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/metric.name.field.html"
    };
}
