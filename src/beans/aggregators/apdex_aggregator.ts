import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";
import {RangeAggregator} from "./range_aggregator";

export class ApdexAggregator extends RangeAggregator {
    public static NAME = "apdex";

    public static fromObject(object: any) {
        const rval = new ApdexAggregator();
        const rangeObj = RangeAggregator.fromObject(object);
        rval.autoValueSwitch = rangeObj.autoValueSwitch;
        rval.parameters = rangeObj.parameters.concat([AnyAggregatorParameter.fromObject(object.parameters[3])]);
        return rval;
    }

    constructor() {
        super(ApdexAggregator.NAME);
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("target")]);
    }
}
