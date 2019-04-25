import _ from "lodash";
import {PromiseUtils} from "../utils/promise_utils";

const TAG_VALUE_SUGGESTIONS_LIMIT = 20;

export class TagInputCtrl {
    public tagValues: string[];
    private $scope: any;
    private promiseUtils: PromiseUtils;

    /** @ngInject **/
    constructor($scope, $q, private uiSegmentSrv) {
        this.promiseUtils = new PromiseUtils($q);
        this.$scope = $scope;
    }

    public getTags(): Promise<string[]> {
        const query = this.$scope.getTagInputValue();
        return this.promiseUtils.resolvedPromise(this.tagValues
            .filter((tagValue) => _.includes(tagValue, query))
            .slice(0, TAG_VALUE_SUGGESTIONS_LIMIT)
            .map((tagValue) => {
                return this.uiSegmentSrv.newSegment(tagValue);
            }));
    }
}

export class TagInputLink {
    constructor(scope, element) {
        scope.getTagInputValue = () => {
            return element[0].getElementsByTagName("input")[0].value;
        };
    }
}

export function TagInputDirective() {
    return {
        bindToController: true,
        controller: TagInputCtrl,
        controllerAs: "ctrl",
        link: TagInputLink,
        restrict: "E",
        scope: {
            onChange: "&",
            segment: "=",
            tagValues: "=",
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/tag.input.html"
    };
}
