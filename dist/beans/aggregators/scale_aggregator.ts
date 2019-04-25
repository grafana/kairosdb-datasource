import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";

export class ScaleAggregator extends Aggregator {
    constructor() {
        super("scale");
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("factor", "by")]);
    }
}
