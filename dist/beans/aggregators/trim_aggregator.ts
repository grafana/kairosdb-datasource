import {Aggregator} from "./aggregator";
import {EnumAggregatorParameter} from "./parameters/enum_aggregator_parameter";
import {Trim} from "./utils";

export class TrimAggregator extends Aggregator {
    constructor() {
        super("trim");
        this.parameters = this.parameters.concat([new EnumAggregatorParameter("trim", Trim, "by")]);
    }
}
