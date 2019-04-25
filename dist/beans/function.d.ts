export declare class TemplatingFunction {
    name: string;
    body: any;
    regexp: string;
    constructor(name: string, body: any);
    run(args: string[]): any;
    private getRegexp();
}
