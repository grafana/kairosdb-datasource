import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";

export class SmaAggregator extends Aggregator {
    constructor() {
        super("sma");
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("size")]);
    }
}
