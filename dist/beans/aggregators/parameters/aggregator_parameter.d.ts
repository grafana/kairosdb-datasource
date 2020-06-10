declare abstract class AggregatorParameter {
    name: string;
    text: string;
    value: string;
    type: AggregatorParameterType;
    constructor(name: string, text?: string, value?: string);
}
export declare type AggregatorParameterType = "alignment" | "any" | "enum" | "limited" | "sampling" | "sampling_unit";
export { AggregatorParameter };
