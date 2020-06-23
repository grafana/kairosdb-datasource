import forEach from "mocha-each";
import {PercentileAggregator} from "../../../src/beans/aggregators/percentile_aggregator";
import {RateAggregator} from "../../../src/beans/aggregators/rate_aggregator";
import {KairosDBTarget} from "../../../src/beans/request/target";
import {TargetValidator} from "../../../src/core/request/target_validator";

interface SplitTargets {
  validTargets: KairosDBTarget[];
  invalidTargets: KairosDBTarget[];
}
describe("TargetValidator", () => {

  const targetWithOnlyName = KairosDBTarget.fromObject( {metricName: "named target"});
  const targetWithScalarOverride = KairosDBTarget.fromObject({metricName: "name and scalar override target", overrideScalar: true});
  const targetWithScalarAgg = KairosDBTarget.fromObject({
    metricName: "scalar aggregator target",
    aggregators: [new PercentileAggregator()]
  });
  const targetWithNonScalarAgg = KairosDBTarget.fromObject({
    metricName: "nonscalar aggregator target",
    aggregators: [new RateAggregator()]
  });

  const nullTarget = null;
  const fromEmptyTarget = KairosDBTarget.fromObject({});
  const fromNullTarget = KairosDBTarget.fromObject(null);

  const getSplitTargets = (enforceScalarSetting: boolean): SplitTargets => {
    if (enforceScalarSetting) {
      return {
        validTargets: [targetWithScalarAgg, targetWithScalarOverride],
        invalidTargets: [targetWithOnlyName, nullTarget, fromEmptyTarget, fromNullTarget, targetWithNonScalarAgg]
      };
    } else {
      return {
        validTargets: [targetWithOnlyName, targetWithScalarAgg, targetWithScalarOverride, targetWithNonScalarAgg],
        invalidTargets: [nullTarget, fromEmptyTarget, fromNullTarget]
      };
    }
  };

    describe ("isValidTarget", () => {
      [true, false].forEach((enforceScalarSetting: boolean) => {
        describe(`with enforceScalarSetting == ${enforceScalarSetting}`, () => {
          const targetValidator: TargetValidator = new TargetValidator(enforceScalarSetting);
          const split = getSplitTargets(enforceScalarSetting);
          forEach(split.invalidTargets).it("should recognize target `%j` as invalid", (target) => {
            // when
            const targetIsValid = targetValidator.isValidTarget(target);
            // then
            // tslint:disable-next-line
            targetIsValid.valid.should.be.false;
          });
          forEach(split.validTargets).it("should recognize target `%(metricName)s` as valid", (target) => {
            // when
            const targetIsValid = targetValidator.isValidTarget(target);
            // then
            // tslint:disable-next-line
            targetIsValid.valid.should.be.true;
          });
        });
      });
      describe("areValidTargets", () => {
        [true, false].forEach((enforceScalarSetting: boolean) => {
          describe(`with enforceScalarSetting == ${enforceScalarSetting}`, () => {
            const targetValidator: TargetValidator = new TargetValidator(enforceScalarSetting);
            const split = getSplitTargets(enforceScalarSetting);
            it("should recognize list of valid targets as valid", () => {
              // then
              const targets = split.validTargets.map((target) => {
                return {query: target};
              });
              // when
              const targetsAreValid = targetValidator.areValidTargets(targets);
              // then
              // tslint:disable-next-line
              targetsAreValid.valid.should.be.true;
            });

            it("should recognize list of targets with an invalid target as invalid", () => {
              // given
              const targets = split.validTargets.concat([nullTarget]).map((target) => {
                return {query: target};
              });
              // when
              const targetsAreValid = targetValidator.areValidTargets(targets);
              // then
              // tslint:disable-next-line
              targetsAreValid.valid.should.be.false;
            });
          });
        });
      });
    });
});
