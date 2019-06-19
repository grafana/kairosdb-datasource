System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var MetricTags;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            MetricTags = (function () {
                function MetricTags() {
                    this.tags = {};
                    this.initialized = false;
                    this.combinations = 0;
                }
                MetricTags.prototype.updateTags = function (tags) {
                    this.tags = tags;
                    this.updateInfo();
                    this.initialized = true;
                };
                MetricTags.prototype.updateInfo = function () {
                    var notEmptyTags = lodash_1.default.pickBy(this.tags, function (value) { return value.length; });
                    this.combinations =
                        lodash_1.default.reduce(lodash_1.default.map(notEmptyTags, function (values) { return values.length; }), function (length1, length2) { return length1 * length2; });
                    this.multiValuedTags = lodash_1.default.keys(lodash_1.default.pickBy(notEmptyTags, function (tagValues) { return tagValues.length > 1; }));
                    this.size = lodash_1.default.keys(this.tags).length;
                };
                return MetricTags;
            })();
            exports_1("MetricTags", MetricTags);
        }
    }
});
//# sourceMappingURL=metric_tags.js.map