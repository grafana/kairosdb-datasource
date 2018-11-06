import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";
import {RangeAggregator} from "./range_aggregator";

export class PercentileAggregator extends RangeAggregator {
    public static NAME = "percentile";

    public static fromObject(object: any) {
        const rval = new PercentileAggregator();
        const rangeObj = RangeAggregator.fromObject(object);
        rval.parameters = rangeObj.parameters.concat([AnyAggregatorParameter.fromObject(object.parameters[3])]);
        return rval;
    }

    constructor() {
        super(PercentileAggregator.NAME);
        this.parameters = this.parameters.concat([new AnyAggregatorParameter(PercentileAggregator.NAME)]);
    }
}
