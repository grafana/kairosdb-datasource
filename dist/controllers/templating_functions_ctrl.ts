import _ from "lodash";
import {TemplatingFunction} from "../beans/function";
import {TemplatingFunctionResolver} from "../utils/templating_function_resolver";

export class TemplatingFunctionsCtrl {
    private functions: TemplatingFunction[] = [];
    private templatingFunctionResolver: TemplatingFunctionResolver;

    constructor(templatingFunctionResolver: TemplatingFunctionResolver) {
        this.templatingFunctionResolver = templatingFunctionResolver;
    }

    public register(func: TemplatingFunction) {
        this.functions.push(func);
    }

    public resolve(functionBody: string, scopedVars) {
        const matchedFunction = _.find(this.functions, (func) => new RegExp(func.regexp).test(functionBody));
        return this.templatingFunctionResolver.unpackFunction(scopedVars, matchedFunction, functionBody);
    }
}
