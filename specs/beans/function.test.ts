import {TemplatingFunction} from "../../src/beans/function";

describe("TemplatingFunction", () => {
    it("should pass all arguments to body", () => {
        // given
        const name: string = "name";
        const body: any = sinon.spy();
        const templatingFunction: TemplatingFunction = new TemplatingFunction(name, body);
        const functionArgs: string[] = ["function arg1", "function 2", "function arg3"];
        // when
        templatingFunction.run(functionArgs);
        // then
        body.getCall(0).args.should.deep.equal(functionArgs);
    });
});
