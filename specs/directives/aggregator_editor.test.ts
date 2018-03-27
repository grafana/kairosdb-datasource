import {Aggregator} from "../../src/beans/aggregators/aggregator";
import {AggregatorEditorDirective} from "../../src/directives/aggregator_editor";

describe("AggregatorEditorController", () => {
    it("should add picks (clones) aggregator correctly", () => {
        // given
        const aggregatorName: string = "Aggregator 1";
        const aggregator: Aggregator = new Aggregator(aggregatorName);
        const scope = {
            ctrl: {
                availableAggregators: [aggregator]
            }
        };
        const link = AggregatorEditorDirective().link;
        link(scope);
        // when
        scope.pickAggregator(aggregatorName);
        // then
        scope.newAggregator.should.not.equal(aggregator);
        scope.newAggregator.should.deep.equal(aggregator);
    });
});
