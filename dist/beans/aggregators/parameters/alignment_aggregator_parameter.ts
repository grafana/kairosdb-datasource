import {Alignment} from "../utils";
import {EnumAggregatorParameter} from "./enum_aggregator_parameter";

export class AlignmentAggregatorParameter extends EnumAggregatorParameter {
    constructor() {
        super("sampling", Alignment, "align by", "NONE");
        this.type = "alignment";
    }
}
