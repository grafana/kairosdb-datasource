import {AnyAggregatorParameter} from "./any_aggregator_parameter";

export class SamplingAggregatorParameter extends AnyAggregatorParameter {
    public static TYPE = "sampling";

    constructor(text: string = name, value: any = null) {
        super("value", text, value);
        this.type = SamplingAggregatorParameter.TYPE;
    }
}
