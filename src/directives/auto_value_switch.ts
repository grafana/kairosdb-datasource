import {AggregatorParameter} from "../beans/aggregators/parameters/aggregator_parameter";
export class AutoValueSwitch {
    public dependentParameters: AggregatorParameter[];
    public enabled: boolean = false;

    constructor(dependentParameters: AggregatorParameter[]) {
        this.dependentParameters = dependentParameters;
    }
}
