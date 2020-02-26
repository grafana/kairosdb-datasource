import {SamplingConverter} from "../src/core/request/sampling_converter";

interface Variables {
    [variableLabel: string]: string[];
}
type FormatterFn = (value: string | string[], variable: any, _unused?: any) => string;

export const buildTemplatingSrvMock = (variables: Variables) => {
    return {
        replace: (expression, scopedVars?: any, format?: string | FormatterFn) => {
            let replacedExpression = expression;
            _.forOwn(variables, (values, key) => {
                const templatedValue = formatterFromTemplateSrv(values, format, variables);
                replacedExpression = replacedExpression.replace("$" + key, templatedValue);
                replacedExpression = replacedExpression.replace("[[" + key + "]]", templatedValue);
            });
            return replacedExpression;
        }
    };
};

const formatterFromTemplateSrv = (
    value: string | string[],
    format: string | FormatterFn,
    variable?: Variables
) => {
    /*
    Based heavily off the real deal.
    https://github.com/grafana/grafana/blob/master/public/app/features/templating/template_srv.ts#L128
     */

    // for some scopedVars there is no variable
    variable = variable || {};

    // Our TemplatingUtils falls into this case - we pass along a custom format fn.
    if (typeof format === "function") {
        return format(value, variable, undefined);
    }

    switch (format) {
        case "regex":
        case "lucene":
        case "pipe":
        case "distributed":
        case "csv":
        case "percentencode":
        case "html": {
            throw Error("Unsupported by this simplified version of the function");
        }
        case "json": {
            return JSON.stringify(value);
        }
        default: {
            /*
            If value is ["abc", "def"]
            return "{abc,def}"
             */
            if (Array.isArray(value) && value.length > 1) {
                return `{${value.join(",")}}`;
            }
            return value;
        }
    }
};

export const buildNoopTemplatingSrvMock = () => {
    return {
        replace: (expression) => expression
    };
};

export const buildSamplingConverterMock = (interval, unit, applicable) => {
    const converterMock = sinon.mock(SamplingConverter);
    converterMock.isApplicable = () => applicable;
    converterMock.convert = (ignore1, ignore2) => {
        return {interval, unit};
    };
    sinon.stub(converterMock, "isApplicable").callThrough();
    sinon.stub(converterMock, "convert").callThrough();
    return converterMock;
};
