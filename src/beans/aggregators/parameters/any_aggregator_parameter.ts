import {AggregatorParameter} from "./aggregator_parameter";

export class AnyAggregatorParameter extends AggregatorParameter {
    constructor(name: string, text: string = name, value: any = null) {
        super(name, text, value);
        this.type = "any";
    }
}
