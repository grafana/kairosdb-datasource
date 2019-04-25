import {EnumValues} from "../utils";
import {LimitedAggregatorParameter} from "./limited_aggregator_parameter";

export class EnumAggregatorParameter extends LimitedAggregatorParameter {
    constructor(name: string, type: any, text: string = name, value: any = null) {
        super(name, EnumValues(type), text, value);
        this.type = "enum";
    }
}
