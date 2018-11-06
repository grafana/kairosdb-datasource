import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";

export class SmaAggregator extends Aggregator {
    public static readonly NAME = "sma";

    public static fromObject(object: any): SmaAggregator {
        const rval = new SmaAggregator();
        rval.parameters = [AnyAggregatorParameter.fromObject(object.parameters[0])];
        return rval;
    }

    constructor() {
        super(SmaAggregator.NAME);
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("size")]);
    }
}
