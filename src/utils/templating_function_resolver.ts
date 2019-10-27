import _ from "lodash";
import {TemplatingUtils} from "./templating_utils";

export class TemplatingFunctionResolver {
    private static FUNCTION_ARGUMENTS_SEPARATOR: string = ",";
    private static FILTER_ARGUMENT_SEPARATOR = "=";
    private static FILTER_ARGUMENT_REGEXP: RegExp =
        new RegExp("^\\S+" + TemplatingFunctionResolver.FILTER_ARGUMENT_SEPARATOR);
    private templatingUtils: TemplatingUtils;

    constructor(templatingUtils: TemplatingUtils) {
        this.templatingUtils = templatingUtils;
    }

    public unpackFunction(scopedVar, matchedFunction, functionBody: string): () => Promise<string[]> {
        const matched = functionBody.match(matchedFunction.regexp);
        const args = matched[1].split(TemplatingFunctionResolver.FUNCTION_ARGUMENTS_SEPARATOR).map((arg) => arg.trim());
        const replacedArgs = args.map((argument) => this.templatingUtils.replace(argument)[0]);
        const simpleArgs = replacedArgs.filter((argument) => !this.isFilterArgument(argument));
        const filters = _.difference(replacedArgs, simpleArgs).map((filterArgument) => this.mapToFilter(filterArgument));
        return () => matchedFunction.body(...simpleArgs, filters.reduce((filter1, filter2) => _.merge(filter1, filter2), {}));
    }

    private mapToFilter(filter: string) {
        const filterParams = filter.split(TemplatingFunctionResolver.FILTER_ARGUMENT_SEPARATOR);
        const filterEntry = {};
        filterEntry[filterParams[0]] = this.templatingUtils.replace(filterParams[1]);
        return filterEntry;
    }

    private isFilterArgument(argument: string): boolean {
        return TemplatingFunctionResolver.FILTER_ARGUMENT_REGEXP.test(argument);
    }
}
