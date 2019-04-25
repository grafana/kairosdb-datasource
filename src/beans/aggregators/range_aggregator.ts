import {AutoValueSwitch} from "../../directives/auto_value_switch";
import {Aggregator} from "./aggregator";
import {AlignmentAggregatorParameter} from "./parameters/alignment_aggregator_parameter";
import {SamplingAggregatorParameter} from "./parameters/sampling_aggregator_parameter";
import {SamplingUnitAggregatorParameter} from "./parameters/sampling_unit_aggregator_parameter";

export class RangeAggregator extends Aggregator {
    constructor(name: string) {
        super(name);
        const samplingAggregatorParameter = new SamplingAggregatorParameter("every", "1");
        const samplingUnitAggregatorParameter = new SamplingUnitAggregatorParameter();
        this.parameters = this.parameters.concat([
            new AlignmentAggregatorParameter(),
            samplingAggregatorParameter,
            samplingUnitAggregatorParameter
        ]);
        this.autoValueSwitch = new AutoValueSwitch([samplingAggregatorParameter, samplingUnitAggregatorParameter]);
    }
}
