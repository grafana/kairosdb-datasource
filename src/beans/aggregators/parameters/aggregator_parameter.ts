abstract class AggregatorParameter {
    public name: string;
    public text: string;
    public value: string;
    public type: string;

    constructor(name: string, text: string = name, value: string = null) {
        this.name = name;
        this.text = text;
        this.value = value;
    }
}

export { AggregatorParameter };
