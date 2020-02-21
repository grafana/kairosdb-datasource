System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, TagsSelectCtrl;
    var __moduleName = context_1 && context_1.id;
    function notNil(obj) {
        return !lodash_1.default.isNil(obj);
    }
    function TagsSelectDirective() {
        return {
            bindToController: true,
            controller: TagsSelectCtrl,
            controllerAs: "ctrl",
            restrict: "E",
            scope: {
                selectedValues: "=",
                tagName: "=",
                tagValues: "="
            },
            templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/tags.select.html"
        };
    }
    exports_1("TagsSelectDirective", TagsSelectDirective);
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            TagsSelectCtrl = (function () {
                function TagsSelectCtrl(uiSegmentSrv) {
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.selectedValues = this.selectedValues.filter(notNil) || [];
                    this.segments = this.selectedValues.map(uiSegmentSrv.newSegment);
                    this.showPlusButtonIfNeeded();
                }
                TagsSelectCtrl.prototype.onChange = function () {
                    this.showPlusButtonIfNeeded();
                    this.updateSelectedValues();
                };
                TagsSelectCtrl.prototype.remove = function (segment) {
                    this.segments = lodash_1.default.without(this.segments, segment);
                    this.updateSelectedValues();
                };
                TagsSelectCtrl.prototype.showPlusButtonIfNeeded = function () {
                    var lastSeg = lodash_1.default.last(this.segments);
                    if (!this.isPlusButton(lastSeg)) {
                        this.segments.push(this.uiSegmentSrv.newPlusButton());
                    }
                };
                TagsSelectCtrl.prototype.updateSelectedValues = function () {
                    var _this = this;
                    this.selectedValues = this.segments
                        .filter(function (segment) { return !_this.isPlusButton(segment); })
                        .map(function (tagSegment) { return tagSegment.value; });
                };
                TagsSelectCtrl.prototype.isPlusButton = function (segment) {
                    return notNil(segment) &&
                        segment.type === "plus-button" &&
                        lodash_1.default.isNil(segment.value);
                };
                return TagsSelectCtrl;
            }());
            exports_1("TagsSelectCtrl", TagsSelectCtrl);
        }
    };
});
//# sourceMappingURL=tags_select.js.map