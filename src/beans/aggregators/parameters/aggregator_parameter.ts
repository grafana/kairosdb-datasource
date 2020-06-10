abstract class AggregatorParameter {
    public name: string;
    public text: string;
    public value: string;
    public type: AggregatorParameterType;

    constructor(name: string, text: string = name, value: string = null) {
        this.name = name;
        this.text = text;
        this.value = value;
    }
}

export type AggregatorParameterType = "alignment" | "any" | "enum" | "limited" | "sampling" | "sampling_unit";
export { AggregatorParameter };
