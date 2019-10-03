import {Aggregator} from "../../../src/beans/aggregators/aggregator";
import {AnyAggregatorParameter} from "../../../src/beans/aggregators/parameters/any_aggregator_parameter";
import {SamplingAggregatorParameter} from "../../../src/beans/aggregators/parameters/sampling_aggregator_parameter";
import {SamplingUnitAggregatorParameter} from "../../../src/beans/aggregators/parameters/sampling_unit_aggregator_parameter";
import {TimeUnit} from "../../../src/beans/aggregators/utils";
import {SamplingParameterConverter} from "../../../src/core/request/sampling_parameter_converter";
import {TimeUnitUtils} from "../../../src/utils/time_unit_utils";
import {buildSamplingConverterMock} from "../../mocks";

describe("SamplingParameterConverter", () => {
    const millisecondsString = TimeUnitUtils.getString(TimeUnit.MINUTES);
    const convertedValue = "5";

    it("should convert unit for interval", () => {
        // given
        const samplingConverterMock = buildSamplingConverterMock(convertedValue, millisecondsString, true);
        const samplingParameterConverter = new SamplingParameterConverter(samplingConverterMock);
        const aggregator = new Aggregator("foo");
        aggregator.parameters = [
            new SamplingAggregatorParameter("text", "5m")
        ];
        // when
        const convertedAggregator = samplingParameterConverter.convertSamplingParameters(aggregator);
        // then
        assert(samplingConverterMock.convert.calledOnce);
        assert(samplingConverterMock.isApplicable.calledOnce);
        convertedAggregator.parameters.should.have.lengthOf(2);
        convertedAggregator.parameters[0].value.should.be.equal(convertedValue);
        convertedAggregator.parameters[1].value.should.be.equal(millisecondsString);
    });

    it("should update both sampling parameters for float", () => {
        // given
        const samplingConverterMock = buildSamplingConverterMock(convertedValue, millisecondsString, true);
        const samplingParameterConverter = new SamplingParameterConverter(samplingConverterMock);
        const aggregator = new Aggregator("foo");
        aggregator.parameters = [
            new SamplingAggregatorParameter("text", "1.2ms")
        ];
        // when
        const convertedAggregator = samplingParameterConverter.convertSamplingParameters(aggregator);
        // then
        assert(samplingConverterMock.convert.calledOnce);
        assert(samplingConverterMock.isApplicable.calledOnce);
        convertedAggregator.parameters.should.have.lengthOf(2);
        convertedAggregator.parameters[0].value.should.be.equal(convertedValue);
        convertedAggregator.parameters[1].value.should.be.equal(millisecondsString);
    });

    it("should not convert parameter-less aggregator", () => {
        // given
        const samplingConverterMock = buildSamplingConverterMock(convertedValue, millisecondsString, true);
        const samplingParameterConverter = new SamplingParameterConverter(samplingConverterMock);
        const aggregator = new Aggregator("foo");
        // when
        const convertedAggregator = samplingParameterConverter.convertSamplingParameters(aggregator);
        // then
        convertedAggregator.parameters.should.have.lengthOf(0);
        assert(samplingConverterMock.isApplicable.notCalled);
        assert(samplingConverterMock.convert.notCalled);
    });

    it("should pass not applicable parameters", () => {
        // given
        const samplingConverterMock = buildSamplingConverterMock(convertedValue, millisecondsString, true);
        const samplingParameterConverter = new SamplingParameterConverter(samplingConverterMock);
        const aggregator = new Aggregator("foo");
        const parameter = new AnyAggregatorParameter("bar", "bar", "1");
        aggregator.parameters = [parameter];
        // when
        const convertedAggregator = samplingParameterConverter.convertSamplingParameters(aggregator);
        // then
        convertedAggregator.parameters.should.have.lengthOf(1);
        assert(samplingConverterMock.isApplicable.notCalled);
        assert(samplingConverterMock.convert.notCalled);
    });

    it("should pass when only unit parameter is present", () => {
        // given
        const samplingConverterMock = buildSamplingConverterMock(convertedValue, millisecondsString, true);
        const samplingParameterConverter = new SamplingParameterConverter(samplingConverterMock);
        const aggregator = new Aggregator("foo");
        const parameter = new SamplingUnitAggregatorParameter();
        aggregator.parameters = [parameter];
        // when
        const convertedAggregator = samplingParameterConverter.convertSamplingParameters(aggregator);
        // then
        convertedAggregator.parameters.should.have.lengthOf(1);
        assert(samplingConverterMock.isApplicable.notCalled);
        assert(samplingConverterMock.convert.notCalled);
    });
});
