import {TemplatingUtils} from "../../src/utils/templating_utils";
import {buildTemplatingSrvMock} from "../mocks";

describe("TemplatingUtils", () => {
    it("should unpack single variable with single value", () => {
        // given
        const variables = {
            variable: ["value"]
        };
        const templatingSrvMock = buildTemplatingSrvMock(variables);
        const templatingUtils = new TemplatingUtils(templatingSrvMock, {});
        const expression = "$variable";
        // when
        const values = templatingUtils.replace(expression);
        // then
        values.length.should.be.equal(1);
        values[0].should.be.equal("value");
    });

    it("should unpack single variable with multiple values", () => {
        // given
        const variables = {
            variable: ["value1", "value2", "value3"]
        };
        const templatingSrvMock = buildTemplatingSrvMock(variables);
        const templatingUtils = new TemplatingUtils(templatingSrvMock, {});
        const expression = "$variable";
        // when
        const values = templatingUtils.replace(expression);
        // then
        values.length.should.be.equal(3);
        values[0].should.be.equal("value1");
        values[1].should.be.equal("value2");
        values[2].should.be.equal("value3");
    });

    it("should unpack single variable with prefix and suffix and multiple values", () => {
        // given
        const variables = {
            variable: ["value1", "value2", "value3"]
        };
        const templatingSrvMock = buildTemplatingSrvMock(variables);
        const templatingUtils = new TemplatingUtils(templatingSrvMock, {});
        const expression = "prefix_$variable_suffix";
        // when
        const values = templatingUtils.replace(expression);
        // then

        values.length.should.be.equal(3);
        values[0].should.be.equal("prefix_value1_suffix");
        values[1].should.be.equal("prefix_value2_suffix");
        values[2].should.be.equal("prefix_value3_suffix");
    });

    it("should replace many multivalue variables with cartesian", () => {
        // given
        const variables = {
            dc: ["dc1", "dc2", "dc3"],
            ip: ["127.0.0.1", "192.168.0.1"]
        };
        const templatingSrvMock = buildTemplatingSrvMock(variables);
        const templatingUtils = new TemplatingUtils(templatingSrvMock, {});
        const expression = "datacenter_[[dc]]_ip_[[ip]]_sth";
        // when
        const values = templatingUtils.replace(expression);
        // then
        values.should.contain("datacenter_dc1_ip_127.0.0.1_sth");
        values.should.contain("datacenter_dc2_ip_127.0.0.1_sth");
        values.should.contain("datacenter_dc3_ip_127.0.0.1_sth");
        values.should.contain("datacenter_dc1_ip_192.168.0.1_sth");
        values.should.contain("datacenter_dc2_ip_192.168.0.1_sth");
        values.should.contain("datacenter_dc3_ip_192.168.0.1_sth");
        values.length.should.be.equal(6);
    });

    it("should replace all expressions", () => {
        // given
        const variables = {
            dc: ["dc1", "dc2", "dc3"]
        };
        const templatingSrvMock = buildTemplatingSrvMock(variables);
        const templatingUtils = new TemplatingUtils(templatingSrvMock, {});
        const expressions = ["$dc", "sth_$dc", "$dc_sth"];
        // when
        const values = templatingUtils.replaceAll(expressions);
        // then
        values.should.contain("dc1");
        values.should.contain("dc2");
        values.should.contain("dc3");
        values.should.contain("sth_dc1");
        values.should.contain("sth_dc2");
        values.should.contain("sth_dc3");
        values.should.contain("dc1_sth");
        values.should.contain("dc2_sth");
        values.should.contain("dc3_sth");
    });
});
