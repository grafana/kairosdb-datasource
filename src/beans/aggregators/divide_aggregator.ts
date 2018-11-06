import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";

export class DivideAggregator extends Aggregator {
    public static NAME = "div";

    public static fromObject(object: any): DivideAggregator {
        const rval = new DivideAggregator();
        rval.parameters = [AnyAggregatorParameter.fromObject(object.parameters[0])];
        return rval;
    }

    constructor() {
        super(DivideAggregator.NAME);
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("divisor", "by")]);
    }
}
