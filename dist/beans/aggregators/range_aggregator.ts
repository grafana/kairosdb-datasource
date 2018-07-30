import {AutoValueSwitch} from "../../directives/auto_value_switch";
import {Aggregator} from "./aggregator";
import {AlignmentAggregatorParameter} from "./parameters/alignment_aggregator_parameter";
import {SamplingAggregatorParameter} from "./parameters/sampling_aggregator_parameter";

export class RangeAggregator extends Aggregator {
    constructor(name: string) {
        super(name);
        const samplingAggregatorParameter = new SamplingAggregatorParameter("every", "1h");
        this.parameters = this.parameters.concat([
            new AlignmentAggregatorParameter(),
            samplingAggregatorParameter,
        ]);
        this.autoValueSwitch = new AutoValueSwitch([samplingAggregatorParameter]);
    }
}
