import _ from "lodash";

export class TemplatingUtils {
    public static MULTI_VALUE_SEPARATOR: string = ",";
    private static MULTI_VALUE_REGEX: RegExp = /{.*?}/g;
    private static MULTI_VALUE_BOUNDARIES: RegExp = /[{}]/g;
    private templateSrv: any;
    private scopedVars: any;

    constructor(templateSrv: any, scopedVars: any) {
        this.templateSrv = templateSrv;
        this.scopedVars = scopedVars;
    }

    public replace(expression: string): string[] {
        const replacedExpression = this.templateSrv.replace(expression, this.scopedVars);
        const matchedMultiValues = replacedExpression.match(TemplatingUtils.MULTI_VALUE_REGEX);

        if (!_.isNil(matchedMultiValues)) {
            let replacedValues = [replacedExpression];
            matchedMultiValues.forEach((multiValue) => {
                const values = multiValue.replace(TemplatingUtils.MULTI_VALUE_BOUNDARIES, "")
                    .split(TemplatingUtils.MULTI_VALUE_SEPARATOR);
                replacedValues = _.flatMap(values, (value) => {
                    return replacedValues.map((replacedValue) => {
                        return replacedValue.replace(multiValue, value);
                    });
                });
            });
            return replacedValues;
        }
        return [replacedExpression];
    }

    public replaceAll(expressions: string[]): string[] {
        return _.flatten(expressions.map((expression) => this.replace(expression)));
    }
}
