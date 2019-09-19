import {EnumValues} from "../utils";
import {LimitedAggregatorParameter} from "./limited_aggregator_parameter";

export class EnumAggregatorParameter extends LimitedAggregatorParameter {
    private readonly enum_type: any;

    public static fromObject(object: any): EnumAggregatorParameter {
        return new EnumAggregatorParameter(object.name, object.enum_type, object.text, object.value);
    }

    constructor(name: string, enum_type: any, text: string = name, value: any = null) {
        super(name, EnumValues(enum_type), text, value);
        this.enum_type = enum_type;
        this.type = "enum";
    }
}
