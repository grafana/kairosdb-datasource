import {Aggregator} from "./aggregator";

import {AlignmentAggregatorParameter} from "./parameters/alignment_aggregator_parameter";
import {EnumAggregatorParameter} from "./parameters/enum_aggregator_parameter";
import {TimeUnit} from "./utils";

export class RateAggregator extends Aggregator {
    public static readonly NAME = "rate";

    public static fromObject(object: any): RateAggregator {
        const rval = new RateAggregator();
        rval.parameters = [
            AlignmentAggregatorParameter.fromObject(object.parameters[0]),
            EnumAggregatorParameter.fromObject(object.parameters[1])
        ];
        return rval;
    }

    constructor() {
        super(RateAggregator.NAME);
        this.parameters = this.parameters.concat([
            new AlignmentAggregatorParameter(),
            new EnumAggregatorParameter("unit", TimeUnit, "every")
        ]);
    }
}
