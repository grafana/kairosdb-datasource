System.register(["lodash", "../utils/promise_utils"], function(exports_1) {
    var lodash_1, promise_utils_1;
    var TAG_VALUE_SUGGESTIONS_LIMIT, TagInputCtrl, TagInputLink;
    function TagInputDirective() {
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
    exports_1("TagInputDirective", TagInputDirective);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (promise_utils_1_1) {
                promise_utils_1 = promise_utils_1_1;
            }],
        execute: function() {
            TAG_VALUE_SUGGESTIONS_LIMIT = 20;
            TagInputCtrl = (function () {
                /** @ngInject **/
                function TagInputCtrl($scope, $q, uiSegmentSrv) {
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.promiseUtils = new promise_utils_1.PromiseUtils($q);
                    this.$scope = $scope;
                }
                TagInputCtrl.prototype.getTags = function () {
                    var _this = this;
                    var query = this.$scope.getTagInputValue();
                    return this.promiseUtils.resolvedPromise(this.tagValues
                        .filter(function (tagValue) { return lodash_1.default.includes(tagValue, query); })
                        .slice(0, TAG_VALUE_SUGGESTIONS_LIMIT)
                        .map(function (tagValue) {
                        return _this.uiSegmentSrv.newSegment(tagValue);
                    }));
                };
                return TagInputCtrl;
            })();
            exports_1("TagInputCtrl", TagInputCtrl);
            TagInputLink = (function () {
                function TagInputLink(scope, element) {
                    scope.getTagInputValue = function () {
                        return element[0].getElementsByTagName("input")[0].value;
                    };
                }
                return TagInputLink;
            })();
            exports_1("TagInputLink", TagInputLink);
        }
    }
});
//# sourceMappingURL=tag_input.js.map