import {AggregatorParameter} from "../beans/aggregators/parameters/aggregator_parameter";

export class AutoValueSwitch {
    public static fromObject(object: any, dependentParameters: AggregatorParameter[]): AutoValueSwitch {
        const rval = new AutoValueSwitch(dependentParameters);
        rval.enabled = object.enabled;
        return rval;
    }

    public dependentParameters: AggregatorParameter[];
    public enabled: boolean = false;

    constructor(dependentParameters: AggregatorParameter[]) {
        this.dependentParameters = dependentParameters;
    }

}
