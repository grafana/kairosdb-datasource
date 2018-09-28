import { AutoValueSwitch } from "../../directives/auto_value_switch";
import { AggregatorParameter } from "./parameters/aggregator_parameter";
export declare class Aggregator {
    name: string;
    parameters: AggregatorParameter[];
    autoValueSwitch: AutoValueSwitch;
    constructor(name: string);
}
