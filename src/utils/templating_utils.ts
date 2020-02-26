import _ from "lodash";

export class TemplatingUtils {
    public static MULTI_VALUE_SEPARATOR: string = "_MAGIC_DELIM_"; // Any sort of uncommon delimiter
    /**
     Keeping this mostly inline with the original
     https://github.com/grafana/grafana/blob/master/public/app/features/templating/template_srv.ts#185
     The difference? The original uses `,` as a delimiter; we need something less common.

     If value is ["abc", "def"]
     return "{abc_MAGIC_DELIM_def}"
     */
    public static customFormatterFn = (
        value: string | string[],
        _variable?: any,
        _unused?: any
      ): string => {
        if (Array.isArray(value)) {
            if (value.length > 1) {
                const inner = (value as string[]).join(TemplatingUtils.MULTI_VALUE_SEPARATOR);
                return `{${inner}}`;
            } else if (value.length === 1) {
                // Shouldn't happen, doesn't hurt to check
                return value[0];
            } else {
                throw Error("You can't format an empty array");
            }
        }
        return value;
    }

    private static MULTI_VALUE_REGEX: RegExp = /{.*?}/g;
    private static MULTI_VALUE_BOUNDARIES: RegExp = /[{}]/g;
    private templateSrv: any;
    private scopedVars: any;

    constructor(templateSrv: any, scopedVars: any) {
        this.templateSrv = templateSrv;
        this.scopedVars = scopedVars;
    }

    public replace(expression: string): string[] {
        const replacedExpression = this.templateSrv.replace(expression, this.scopedVars, TemplatingUtils.customFormatterFn);
        if (replacedExpression) {
            // Looks like "thing0" if single value, or "{thing1_MAGIC_DELIM_thing2}" if multivalue

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
        }
        return [replacedExpression];
    }

    public replaceAll(expressions: string[]): string[] {
        return _.flatten(expressions.map((expression) => this.replace(expression)));
    }
}
