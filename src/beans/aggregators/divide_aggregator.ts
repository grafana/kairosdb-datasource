import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";

export class DivideAggregator extends Aggregator {
    constructor() {
        super("div");
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("divisor", "by")]);
    }
}
