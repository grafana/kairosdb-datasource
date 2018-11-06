import {TimeUnit} from "../utils";
import {EnumAggregatorParameter} from "./enum_aggregator_parameter";

export class SamplingUnitAggregatorParameter extends EnumAggregatorParameter {
    public static TYPE = "sampling_unit";

    public static fromObject(object: any): SamplingUnitAggregatorParameter {
        const rval = new SamplingUnitAggregatorParameter();
        rval.value = object.value;
        return rval;
    }

    constructor() {
        super("unit", TimeUnit, "unit", "HOURS");
        this.type = SamplingUnitAggregatorParameter.TYPE;
    }
}
