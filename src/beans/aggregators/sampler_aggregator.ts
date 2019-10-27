import {Aggregator} from "./aggregator";
import {EnumAggregatorParameter} from "./parameters/enum_aggregator_parameter";
import {TimeUnit} from "./utils";

export class SamplerAggregator extends Aggregator {
    constructor() {
        super("sampler");
        this.parameters = this.parameters.concat([
            new EnumAggregatorParameter("unit", TimeUnit, "every")
        ]);
    }
}
