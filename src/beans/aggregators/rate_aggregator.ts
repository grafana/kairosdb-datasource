import {Aggregator} from "./aggregator";

import {AlignmentAggregatorParameter} from "./parameters/alignment_aggregator_parameter";
import {EnumAggregatorParameter} from "./parameters/enum_aggregator_parameter";
import {TimeUnit} from "./utils";

export class RateAggregator extends Aggregator {
    constructor() {
        super("rate");
        this.parameters = this.parameters.concat([
            new AlignmentAggregatorParameter(),
            new EnumAggregatorParameter("unit", TimeUnit, "every")
        ]);
    }
}
