System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, KairosDBResponseHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            KairosDBResponseHandler = (function () {
                function KairosDBResponseHandler(seriesNameBuilder) {
                    this.seriesNameBuilder = seriesNameBuilder;
                }
                KairosDBResponseHandler.prototype.convertToDatapoints = function (data, aliases) {
                    var _this = this;
                    var datapoints = lodash_1.default.zip(aliases, data.queries)
                        .map(function (pair) {
                        return { alias: pair[0], results: pair[1].results };
                    })
                        .map(function (entry) { return lodash_1.default.map(entry.results, function (result) {
                        return {
                            datapoints: lodash_1.default.flatMap(result.values, function (value) {
                                var v = value[1];
                                if (typeof (v) === "object" && v.bins) {
                                    var bins_1 = v.bins;
                                    return lodash_1.default.map(Object.keys(bins_1), function (k) { return [parseFloat(k), value[0], bins_1[k]]; });
                                }
                                else {
                                    return [value.reverse()];
                                }
                            }),
                            target: _this.seriesNameBuilder.build(result.name, entry.alias, result.group_by)
                        };
                    }); });
                    return { data: lodash_1.default.flatten(datapoints) };
                };
                return KairosDBResponseHandler;
            }());
            exports_1("KairosDBResponseHandler", KairosDBResponseHandler);
        }
    };
});
//# sourceMappingURL=response_handler.js.map