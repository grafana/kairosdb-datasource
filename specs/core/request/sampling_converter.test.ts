import {TimeUnit} from "../../../src/beans/aggregators/utils";
import {SamplingConverter} from "../../../src/core/request/sampling_converter";
import {SamplingParameterConverter} from "../../../src/core/request/sampling_parameter_converter";
import {TimeUnitUtils} from "../../../src/utils/time_unit_utils";

describe("SamplingParameterConverter", () => {
    const samplingConverter = new SamplingConverter();
    it("should recognize as applicable", () => {
        // given
        // when
        const isApplicable = samplingConverter.isApplicable(42.2);
        // then
        // tslint:disable-next-line
        isApplicable.should.be.true;
    });

    it("should not recognize as applicable", () => {
        // given
        // when
        const isApplicable = samplingConverter.isApplicable(42.0);
        // then
        // tslint:disable-next-line
        isApplicable.should.be.false;
    });

    it("should not recognize as applicable", () => {
        // given
        // when
        const isApplicable = samplingConverter.isApplicable(42);
        // then
        // tslint:disable-next-line
        isApplicable.should.be.false;
    });

    it("should convert to milliseconds", () => {
        // given
        const unit = TimeUnitUtils.getString(TimeUnit.HOURS);
        const value = 1.5;
        // when
        const convertedSampling = samplingConverter.convert(value, unit);
        // then
        convertedSampling.unit.should.be.equal("MILLISECONDS");
        convertedSampling.interval.should.be.equal("5400000");
    });

    it("should throw when value is is float and time unit is milliseconds", () => {
        expect(() => {
            // given
            const unit = TimeUnitUtils.getString(TimeUnit.MILLISECONDS);
            const value = 1.5;
            // when
            samplingConverter.convert(value, unit);
        }).to.throw();
    });
});
