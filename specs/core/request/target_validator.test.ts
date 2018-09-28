import forEach from "mocha-each";
import {KairosDBTarget} from "../../../src/beans/request/target";
import {TargetValidator} from "../../../src/core/request/target_validator";

describe("TargetValidator", () => {
    const targetValidator: TargetValidator = new TargetValidator();

    const newNamedKairosDBTarget = (metricName) => {
        const target = new KairosDBTarget();
        target.metricName = metricName;
        return target;
    };
    const validTargets = [
        "named target",
        "another valid target",
        "yet another valid target"
    ].map(newNamedKairosDBTarget);
    const anInvalidTarget = new KairosDBTarget();
    const invalidTargets = [
        anInvalidTarget,
        null,
        newNamedKairosDBTarget(null)
    ];

    forEach(invalidTargets).it("should recognize target `%j` as invalid", (target) => {
        // when
        const targetIsValid = targetValidator.isValidTarget(target);
        // then
        // tslint:disable-next-line
        targetIsValid.should.be.false;
    });

    forEach(validTargets).it("should recognize target `%(metricName)s` as valid", (target) => {
        // when
        const targetIsValid = targetValidator.isValidTarget(target);
        // then
        // tslint:disable-next-line
        targetIsValid.should.be.true;
    });

    it("should recognize list of valid targets as valid", () => {
        // then
        const targets = validTargets.map((target) => {
            return {query: target};
        });
        // when
        const targetsAreValid = targetValidator.areValidTargets(targets);
        // then
        // tslint:disable-next-line
        targetsAreValid.should.be.true;
    });

    it("should recognize list of targets with an invalid target as invalid", () => {
        // given
        const targets = validTargets.concat([anInvalidTarget]).map((target) => {
            return {query: target};
        });
        // when
        const targetsAreValid = targetValidator.areValidTargets(targets);
        // then
        // tslint:disable-next-line
        targetsAreValid.should.be.false;
    });
});
