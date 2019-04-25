import {Aggregator} from "../../src/beans/aggregators/aggregator";
import {RangeAggregator} from "../../src/beans/aggregators/range_aggregator";
import {AggregatorsCtrl} from "../../src/directives/aggregators";

describe("AggregatorsController", () => {
    const aggregatorCtrl: AggregatorsCtrl = new AggregatorsCtrl();
    aggregatorCtrl.entries = [];

    it("should add aggregator", () => {
        // given
        const aggregator: Aggregator = new Aggregator("aggregator name");
        // when
        aggregatorCtrl.add(aggregator);
        // then
        aggregatorCtrl.entries.should.contain(aggregator);
    });

    it("should remove aggregator", () => {
        // given
        const aggregator: Aggregator = new Aggregator("aggregator name");
        aggregatorCtrl.add(aggregator);
        // when
        aggregatorCtrl.remove(aggregator);
        // then
        aggregatorCtrl.entries.should.not.contain(aggregator);
    });

    it("should allow to add more aggregators of the same type", () => {
        // given
        const aggregator1: Aggregator = new RangeAggregator("agg1");
        const aggregator2: Aggregator = new RangeAggregator("agg2");
        // when
        aggregatorCtrl.add(aggregator1);
        aggregatorCtrl.add(aggregator2);
        // then
        aggregatorCtrl.entries.should.contain(aggregator1);
        aggregatorCtrl.entries.should.contain(aggregator2);
    });
});
