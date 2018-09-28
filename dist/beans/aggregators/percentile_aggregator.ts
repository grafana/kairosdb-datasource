import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";
import {RangeAggregator} from "./range_aggregator";

export class PercentileAggregator extends RangeAggregator {
    constructor() {
        super("percentile");
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("percentile")]);
    }
}
