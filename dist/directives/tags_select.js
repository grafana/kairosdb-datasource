System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var TagsSelectCtrl;
    function TagsSelectDirective() {
        return {
            bindToController: true,
            controller: TagsSelectCtrl,
            controllerAs: "ctrl",
            restrict: "E",
            scope: {
                selectedValues: "=",
                tagName: "=",
                tagValues: "=",
                tags: "=",
            },
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/tags.select.html"
        };
    }
    exports_1("TagsSelectDirective", TagsSelectDirective);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            TagsSelectCtrl = (function () {
                /** @ngInject **/
                function TagsSelectCtrl(uiSegmentSrv) {
                    var _this = this;
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.selectedValues = this.selectedValues || [];
                    this.segments = this.selectedValues.map(function (tagValue) { return _this.uiSegmentSrv.newSegment({ value: tagValue, cssClass: "query-part" }); });
                    this.segments.push(this.uiSegmentSrv.newPlusButton());
                }
                TagsSelectCtrl.prototype.onChange = function () {
                    if (!lodash_1.default.isNil(lodash_1.default.last(this.segments).value)) {
                        this.segments.push(this.uiSegmentSrv.newPlusButton());
                    }
                    this.update();
                };
                TagsSelectCtrl.prototype.remove = function (segment) {
                    this.segments = lodash_1.default.without(this.segments, segment);
                    this.update();
                };
                TagsSelectCtrl.prototype.removeTag = function () {
                    delete this.tags[this.tagName];
                };
                TagsSelectCtrl.prototype.update = function () {
                    this.selectedValues = this.segments
                        .map(function (tagSegment) { return tagSegment.value; })
                        .filter(function (value) { return !lodash_1.default.isNil(value); });
                };
                return TagsSelectCtrl;
            })();
            exports_1("TagsSelectCtrl", TagsSelectCtrl);
        }
    }
});
//# sourceMappingURL=tags_select.js.map