import { TemplatingUtils } from "./templating_utils";
export declare class TemplatingFunctionResolver {
    private static FUNCTION_ARGUMENTS_SEPARATOR;
    private static FILTER_ARGUMENT_SEPARATOR;
    private static FILTER_ARGUMENT_REGEXP;
    private templatingUtils;
    constructor(templatingUtils: TemplatingUtils);
    unpackFunction(scopedVar: any, matchedFunction: any, functionBody: string): () => Promise<string[]>;
    private mapToFilter(filter);
    private isFilterArgument(argument);
}
