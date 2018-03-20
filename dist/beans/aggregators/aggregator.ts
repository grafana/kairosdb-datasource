import {AutoValueSwitch} from "../../directives/auto_value_switch";
import {AggregatorParameter} from "./parameters/aggregator_parameter";

export class Aggregator {
    public name: string;
    public parameters: AggregatorParameter[] = [];
    public autoValueSwitch: AutoValueSwitch = undefined;

    constructor(name: string) {
        this.name = name;
    }
}
