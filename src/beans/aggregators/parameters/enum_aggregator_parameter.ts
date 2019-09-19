import {EnumValues} from "../utils";
import {LimitedAggregatorParameter} from "./limited_aggregator_parameter";

export class EnumAggregatorParameter extends LimitedAggregatorParameter {
    public static fromObject(object: any): EnumAggregatorParameter {
        return new EnumAggregatorParameter(object.name, object.enumType, object.text, object.value);
    }

    private readonly enumType: any;

    constructor(name: string, enumType: any, text: string = name, value: any = null) {
        super(name, EnumValues(enumType), text, value);
        this.enumType = enumType;
        this.type = "enum";
    }
}
