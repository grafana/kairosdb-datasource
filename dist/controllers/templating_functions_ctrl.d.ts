import { TemplatingFunction } from "../beans/function";
import { TemplatingFunctionResolver } from "../utils/templating_function_resolver";
export declare class TemplatingFunctionsCtrl {
    private functions;
    private templatingFunctionResolver;
    constructor(templatingFunctionResolver: TemplatingFunctionResolver);
    register(func: TemplatingFunction): void;
    resolve(functionBody: string, scopedVars: any): () => Promise<string[]>;
}
