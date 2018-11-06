import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";

export class ScaleAggregator extends Aggregator {
    public static readonly NAME = "scale";

    public static fromObject(object: any): ScaleAggregator {
        const rval = new ScaleAggregator();
        rval.parameters = [AnyAggregatorParameter.fromObject(object.parameters[0])];
        return rval;
    }

    constructor() {
        super(ScaleAggregator.NAME);
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("factor", "by")]);
    }
}
