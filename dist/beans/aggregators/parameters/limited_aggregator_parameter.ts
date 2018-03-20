import {AggregatorParameter} from "./aggregator_parameter";
export class LimitedAggregatorParameter extends AggregatorParameter {
    private allowedValues: any[];

    constructor(name: string, allowedValues: any[], text: string = name, value: any = null) {
        super(name, text, value);
        this.allowedValues = allowedValues;
        this.type = "limited";
    }
}
