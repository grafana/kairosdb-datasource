import {Aggregator} from "./aggregator";

import {AlignmentAggregatorParameter} from "./parameters/alignment_aggregator_parameter";
import {EnumAggregatorParameter} from "./parameters/enum_aggregator_parameter";
import {TimeUnit} from "./utils";

export class RateAggregator extends Aggregator {
    public static readonly NAME = "rate";

    public static fromObject(object: Aggregator): RateAggregator {
        const unitParam = object.parameters.find((p) => p.name === "unit");
        const unitParamCopy = EnumAggregatorParameter.fromObject(unitParam);

        const rval = new RateAggregator();
        rval.parameters = [unitParamCopy];
        return rval;
    }

    constructor() {
        super(RateAggregator.NAME);
        this.parameters = this.parameters.concat([
            new EnumAggregatorParameter("unit", TimeUnit, "every")
            // per KairosDB docs, rate also supports `sampling` and `time_zone` params.
        ]);
    }
}
