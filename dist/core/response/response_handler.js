System.register(["lodash"], function(exports_1) {
    var lodash_1;
    var KairosDBResponseHandler;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
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
                            datapoints: result.values.map(function (value) { return value.reverse(); }),
                            target: _this.seriesNameBuilder.build(result.name, entry.alias, result.group_by)
                        };
                    }); });
                    return { data: lodash_1.default.flatten(datapoints) };
                };
                return KairosDBResponseHandler;
            })();
            exports_1("KairosDBResponseHandler", KairosDBResponseHandler);
        }
    }
});
//# sourceMappingURL=response_handler.js.map