System.register(["./aggregator", "./divide_aggregator", "./percentile_aggregator", "./range_aggregator", "./rate_aggregator", "./sampler_aggregator", "./scale_aggregator", "./sma_aggregator", "./trim_aggregator"], function(exports_1) {
    var aggregator_1, divide_aggregator_1, percentile_aggregator_1, range_aggregator_1, rate_aggregator_1, sampler_aggregator_1, scale_aggregator_1, sma_aggregator_1, trim_aggregator_1;
    var AGGREGATORS;
    return {
        setters:[
            function (aggregator_1_1) {
                aggregator_1 = aggregator_1_1;
            },
            function (divide_aggregator_1_1) {
                divide_aggregator_1 = divide_aggregator_1_1;
            },
            function (percentile_aggregator_1_1) {
                percentile_aggregator_1 = percentile_aggregator_1_1;
            },
            function (range_aggregator_1_1) {
                range_aggregator_1 = range_aggregator_1_1;
            },
            function (rate_aggregator_1_1) {
                rate_aggregator_1 = rate_aggregator_1_1;
            },
            function (sampler_aggregator_1_1) {
                sampler_aggregator_1 = sampler_aggregator_1_1;
            },
            function (scale_aggregator_1_1) {
                scale_aggregator_1 = scale_aggregator_1_1;
            },
            function (sma_aggregator_1_1) {
                sma_aggregator_1 = sma_aggregator_1_1;
            },
            function (trim_aggregator_1_1) {
                trim_aggregator_1 = trim_aggregator_1_1;
            }],
        execute: function() {
            exports_1("AGGREGATORS", AGGREGATORS = [
                new range_aggregator_1.RangeAggregator("avg"),
                new range_aggregator_1.RangeAggregator("dev"),
                new range_aggregator_1.RangeAggregator("count"),
                new aggregator_1.Aggregator("diff"),
                new divide_aggregator_1.DivideAggregator(),
                new range_aggregator_1.RangeAggregator("first"),
                new range_aggregator_1.RangeAggregator("gaps"),
                new range_aggregator_1.RangeAggregator("last"),
                new range_aggregator_1.RangeAggregator("least_squares"),
                new range_aggregator_1.RangeAggregator("max"),
                new range_aggregator_1.RangeAggregator("min"),
                new percentile_aggregator_1.PercentileAggregator(),
                new rate_aggregator_1.RateAggregator(),
                new sampler_aggregator_1.SamplerAggregator(),
                new scale_aggregator_1.ScaleAggregator(),
                new sma_aggregator_1.SmaAggregator(),
                new range_aggregator_1.RangeAggregator("sum"),
                new trim_aggregator_1.TrimAggregator()
            ]);
        }
    }
});
//# sourceMappingURL=aggregators.js.map