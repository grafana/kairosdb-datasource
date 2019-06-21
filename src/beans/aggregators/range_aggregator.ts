import {AutoValueSwitch} from "../../directives/auto_value_switch";
import {Aggregator} from "./aggregator";
import {AlignmentAggregatorParameter} from "./parameters/alignment_aggregator_parameter";
import {SamplingAggregatorParameter} from "./parameters/sampling_aggregator_parameter";
import {SamplingUnitAggregatorParameter} from "./parameters/sampling_unit_aggregator_parameter";

export class RangeAggregator extends Aggregator {
    public static fromObject(object: any): RangeAggregator {
        const rval = new RangeAggregator(object.name);
        const alignment = AlignmentAggregatorParameter.fromObject(object.parameters[0]);
        const sampleAgg = SamplingAggregatorParameter.fromObject(object.parameters[1]);
        const sampleUnit = SamplingUnitAggregatorParameter.fromObject(object.parameters[2]);
        rval.parameters = [alignment, sampleAgg, sampleUnit];
        rval.autoValueSwitch = AutoValueSwitch.fromObject(object.autoValueSwitch, [sampleAgg, sampleUnit]);
        return rval;
    }

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
