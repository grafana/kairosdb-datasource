import _ from "lodash";
import {Aggregator} from "../../src/beans/aggregators/aggregator";
import {AGGREGATORS} from "../../src/beans/aggregators/aggregators";
import {AlignmentAggregatorParameter} from "../../src/beans/aggregators/parameters/alignment_aggregator_parameter";
import {RangeAggregator} from "../../src/beans/aggregators/range_aggregator";

describe("AGGREGATORS", () => {
    describe("should only have a AlignmentAggregatorParameter if they are a RangeAggregator:", () => {
        AGGREGATORS.forEach((agg: Aggregator) => {
            const isRangeAgg = agg instanceof RangeAggregator;
            it(`${agg.name} should ${!isRangeAgg ? "not" : ""} have an alignment param:`, () => {
                expect(hasAlignmentParam(agg)).equal(isRangeAgg);
            });
        });
    });
});

function hasAlignmentParam(agg: Aggregator): boolean {
    const param = agg.parameters.find((p) => {
        return p instanceof AlignmentAggregatorParameter;
    });
    return !_.isNil(param);
}
