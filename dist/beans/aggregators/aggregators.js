System.register(["./aggregator", "./divide_aggregator", "./percentile_aggregator", "./range_aggregator", "./rate_aggregator", "./sampler_aggregator", "./scale_aggregator", "./sma_aggregator", "./trim_aggregator"], function (exports_1, context_1) {
    "use strict";
    var aggregator_1, divide_aggregator_1, percentile_aggregator_1, range_aggregator_1, rate_aggregator_1, sampler_aggregator_1, scale_aggregator_1, sma_aggregator_1, trim_aggregator_1, AGGREGATORS, RANGE_AGGREGATORS;
    var __moduleName = context_1 && context_1.id;
    function fromObject(object) {
        if (object.name in RANGE_AGGREGATORS) {
            return range_aggregator_1.RangeAggregator.fromObject(object);
        }
        else if (object.name === percentile_aggregator_1.PercentileAggregator.NAME) {
            return percentile_aggregator_1.PercentileAggregator.fromObject(object);
        }
        else if (object.name === sma_aggregator_1.SmaAggregator.NAME) {
            return sma_aggregator_1.SmaAggregator.fromObject(object);
        }
        else if (object.name === divide_aggregator_1.DivideAggregator.NAME) {
            return divide_aggregator_1.DivideAggregator.fromObject(object);
        }
        else if (object.name === rate_aggregator_1.RateAggregator.NAME) {
            return rate_aggregator_1.RateAggregator.fromObject(object);
        }
        else if (object.name === sampler_aggregator_1.SamplerAggregator.NAME) {
            return sampler_aggregator_1.SamplerAggregator.fromObject(object);
        }
        else if (object.name === scale_aggregator_1.ScaleAggregator.NAME) {
            return scale_aggregator_1.ScaleAggregator.fromObject(object);
        }
        else if (object.name === trim_aggregator_1.TrimAggregator.NAME) {
            return trim_aggregator_1.TrimAggregator.fromObject(object);
        }
        else if (object.name === "diff") {
            return new aggregator_1.Aggregator("diff");
        }
        return object;
    }
    exports_1("fromObject", fromObject);
    return {
        setters: [
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
            }
        ],
        execute: function () {
            exports_1("AGGREGATORS", AGGREGATORS = [
                new range_aggregator_1.RangeAggregator("avg"),
                new range_aggregator_1.RangeAggregator("dev"),
                new range_aggregator_1.RangeAggregator("count"),
                new range_aggregator_1.RangeAggregator("first"),
                new range_aggregator_1.RangeAggregator("gaps"),
                new range_aggregator_1.RangeAggregator("last"),
                new range_aggregator_1.RangeAggregator("least_squares"),
                new range_aggregator_1.RangeAggregator("max"),
                new range_aggregator_1.RangeAggregator("min"),
                new range_aggregator_1.RangeAggregator("gaps"),
                new range_aggregator_1.RangeAggregator("merge"),
                new range_aggregator_1.RangeAggregator("movingWindow"),
                new percentile_aggregator_1.PercentileAggregator(),
                new sma_aggregator_1.SmaAggregator(),
                new range_aggregator_1.RangeAggregator("sum"),
                new aggregator_1.Aggregator("diff"),
                new divide_aggregator_1.DivideAggregator(),
                new rate_aggregator_1.RateAggregator(),
                new sampler_aggregator_1.SamplerAggregator(),
                new scale_aggregator_1.ScaleAggregator(),
                new trim_aggregator_1.TrimAggregator()
            ]);
            RANGE_AGGREGATORS = ["avg", "dev", "count", "first", "gaps",
                "last", "least_squares", "max", "min", "gaps", "merge", "sum", "movingWindow"];
        }
    };
});
//# sourceMappingURL=aggregators.js.map