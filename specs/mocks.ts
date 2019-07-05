import moment from "moment";
import {SamplingConverter} from "../src/core/request/sampling_converter";

export const buildTemplatingSrvMock = (variables) => {
    return {
        replace: (expression) => {
            let replacedExpression = expression;
            _.forOwn(variables, (values, key) => {
                const templatedValue = values.length > 1 ? "{" + _.join(values, ",") + "}" : values[0];
                replacedExpression = replacedExpression.replace("$" + key, templatedValue);
                replacedExpression = replacedExpression.replace("[[" + key + "]]", templatedValue);
            });
            return replacedExpression;
        },
        timeRange: { to: moment(), from: moment() }
    };
};

export const buildNoopTemplatingSrvMock = () => {
    return {
        replace: (expression) => expression,
        timeRange: {to: moment(), from: moment()}
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
