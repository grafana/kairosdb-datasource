export class TemplatingFunction {
    public name: string;
    public body: any;
    public regexp: string;

    constructor(name: string, body: any) {
        this.name = name;
        this.body = body;
        this.regexp = this.getRegexp();
    }

    public run(args: string[]) {
        return this.body(...args);
    }

    private getRegexp(): string {
        return "^" + this.name + "\\(([\\S ]+)\\)" + "$";
    }
}
