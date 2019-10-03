// tslint:disable:no-console
import forEach from "mocha-each";
import {TemplatingFunction} from "../../src/beans/function";
import {TemplatingFunctionsCtrl} from "../../src/controllers/templating_functions_ctrl";
import {TemplatingFunctionResolver} from "../../src/utils/templating_function_resolver";
import {TemplatingUtils} from "../../src/utils/templating_utils";
import {buildTemplatingSrvMock} from "../mocks";

describe("TemplatingFunctionsController", () => {
    const variables = {
        variable1: ["a", "b", "c"],
        variable2: ["d", "e", "f"]
    };
    const templatingSrvMock = buildTemplatingSrvMock(variables);
    const templatingFunctionsController: TemplatingFunctionsCtrl =
        new TemplatingFunctionsCtrl(new TemplatingFunctionResolver(new TemplatingUtils(templatingSrvMock, {})));
    const metricsFunction = new TemplatingFunction("metrics", (metricNamePart) => ["metric1", "metric2", "metric3"]);
    const tagNamesFunction = new TemplatingFunction("tag_names", (metricName) => ["tag1", "tag2", "tag3"]);
    const tagValuesFunction = new TemplatingFunction("tag_values",
        (metricName, tagName, filters) => ["tag_value1", "tag_value2", "tag_value3"]);
    [metricsFunction, tagNamesFunction, tagValuesFunction].forEach((func) => {
        templatingFunctionsController.register(func);
        func.body = sinon.spy(func.body);
    });

    forEach([
        ["metrics(param)", metricsFunction],
        ["metrics(param1,param2)", metricsFunction],
        ["metrics(param1, param2)", metricsFunction],
        ["tag_names(metric)", tagNamesFunction],
        ["tag_values(metric,param2,param3)", tagValuesFunction],
        ["tag_values(metric, param2, param3)", tagValuesFunction],
        ["tag_values(metric, param2, param3, filter1=$filter_variable1, filter2=$filter_variable2)", tagValuesFunction],
    ]).it("should resolve %s as a function", (functionQuery, expectedFunction) => {
        // when
        templatingFunctionsController.resolve(functionQuery)();
        // then
        assert(expectedFunction.body.calledOnce);
        expectedFunction.body.reset();
    });

    forEach([
        "nonExistingfunction(1,321)",
        "metrics()",
        "tag_names()",
        "tag_values()",
    ]).it("should not resolve %s as a function", (functionQuery) => {
        expect(() => {
            // when
            templatingFunctionsController.resolve(functionQuery);
        }).to.throw();
    });

    // it("should convert single filter argument to single entry filter object", () => {
    //     // given
    //     const functionQuery = "tag_values(metric_name,tag_name,filter1=$variable1)";
    //     const expectedFunction = tagValuesFunction;
    //     // when
    //     templatingFunctionsController.resolve(functionQuery)();
    //     // then
    //     assert(expectedFunction.body.calledWith("metric_name", "tag_name", {filter1: variables.variable1}));
    //     expectedFunction.body.reset();
    // });

    // it("should convert single filter argument with prefix and suffix to single entry filter object", () => {
    //     // given
    //     const functionQuery = "tag_values(metric_name,tag_name,filter1=prefix_$variable1_suffix)";
    //     const expectedFunction = tagValuesFunction;
    //     const expectedFilters = _.map(variables.variable1, (value) => "prefix_" + value + "_suffix");
    //     // when
    //     templatingFunctionsController.resolve(functionQuery)();
    //     // then
    //     assert(expectedFunction.body.calledWith("metric_name", "tag_name", {filter1: expectedFilters}));
    //     expectedFunction.body.reset();
    // });

    // it("should convert multiple filter arguments to multiple entries filter object", () => {
    //     // given
    //     const functionQuery = "tag_values(metric_name,tag_name, filter1=$variable1, filter2=$variable2)";
    //     const expectedFunction = tagValuesFunction;
    //     // when
    //     templatingFunctionsController.resolve(functionQuery)();
    //     // then
    //     assert(expectedFunction.body.calledWith("metric_name", "tag_name",
    //         {filter1: variables.variable1, filter2: variables.variable2}));
    //     expectedFunction.body.reset();
    // });
});
