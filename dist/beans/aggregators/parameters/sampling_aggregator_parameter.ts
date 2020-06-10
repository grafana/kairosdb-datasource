import {AggregatorParameterType} from "./aggregator_parameter";
import {AnyAggregatorParameter} from "./any_aggregator_parameter";

export class SamplingAggregatorParameter extends AnyAggregatorParameter {
    public static TYPE: AggregatorParameterType = "sampling";

    public static fromObject(object: any): SamplingAggregatorParameter {
        return new SamplingAggregatorParameter(object.text, object.value);
    }

    constructor(text: string = name, value: any = null) {
        super("value", text, value);
        this.type = SamplingAggregatorParameter.TYPE;
    }
}
