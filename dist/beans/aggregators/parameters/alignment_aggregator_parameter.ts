import {Alignment} from "../utils";
import {EnumAggregatorParameter} from "./enum_aggregator_parameter";

export class AlignmentAggregatorParameter extends EnumAggregatorParameter {
    public static fromObject(object: any): AlignmentAggregatorParameter {
        const rval = new AlignmentAggregatorParameter();
        rval.value = object.value;
        return rval;
    }

    constructor() {
        super("sampling", Alignment, "align by", "PERIOD");
        this.type = "alignment";
    }
}
