import {Aggregator} from "./aggregator";
import {AnyAggregatorParameter} from "./parameters/any_aggregator_parameter";
import {EnumAggregatorParameter} from "./parameters/enum_aggregator_parameter";
import {Filter} from "./utils";

export class FilterAggregator extends Aggregator {
    public static NAME = "filter";

    public static fromObject(object: any): FilterAggregator {
        const rval = new FilterAggregator();
        rval.parameters = [
            EnumAggregatorParameter.fromObject(object.parameters[0]),
            AnyAggregatorParameter.fromObject(object.parameters[1])
        ];
        return rval;
    }

    constructor() {
        super(FilterAggregator.NAME);
        this.parameters = this.parameters.concat([
            new EnumAggregatorParameter("filter_op", Filter, "filter"),
            new AnyAggregatorParameter("threshold", "threshold")
        ]);
    }
}
