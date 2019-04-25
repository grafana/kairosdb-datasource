import {TimeUnit} from "../utils";
import {EnumAggregatorParameter} from "./enum_aggregator_parameter";

export class SamplingUnitAggregatorParameter extends EnumAggregatorParameter {
    public static TYPE = "sampling_unit";

    constructor() {
        super("unit", TimeUnit, "unit", "HOURS");
        this.type = SamplingUnitAggregatorParameter.TYPE;
    }
}
