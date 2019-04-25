import _ from "lodash";
import {KairosDBTarget} from "../../beans/request/target";

export class TargetValidator {
    public areValidTargets(targets): boolean {
        return targets && targets.every((target) => this.isValidTarget(target.query));
    }

    public isValidTarget(target: KairosDBTarget): boolean {
        return !_.isNil(target) && !_.isEmpty(target.metricName);
    }
}
