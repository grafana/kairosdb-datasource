import {AggregatorParameter} from "./aggregator_parameter";

export class AnyAggregatorParameter extends AggregatorParameter {
    public static fromObject(object: any): AggregatorParameter {
        return new AnyAggregatorParameter(object.name, object.text, object.value);
    }

    constructor(name: string, text: string = name, value: any = null) {
        super(name, text, value);
        this.type = "any";
    }
}
