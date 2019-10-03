import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";

export class SamplerAggregator extends Aggregator {
    constructor() {
        super("sampler");
        this.parameters = this.parameters.concat([new AnyAggregatorParameter("samplingUnit", "every")]);
    }
}
