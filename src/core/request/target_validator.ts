import _ from "lodash";
import {SCALAR_AGGREGATOR_NAMES} from "../../beans/aggregators/aggregators";
import {KairosDBTarget} from "../../beans/request/target";

export type ValidatorResponse = ValidatorSuccessResponse | ValidatorFailureResponse;
export interface ValidatorSuccessResponse {
  valid: true;
}

export interface ValidatorFailureResponse {
  valid: false;
  reason: string;
}

export class TargetValidator {
    private enforceScalarSetting;

    constructor(enforceScalarSetting) {
      this.enforceScalarSetting = enforceScalarSetting;
    }

    public areValidTargets(targets): ValidatorResponse {

        if (_.isNil(targets) || _.isEmpty(targets)) {
          return {
            valid: false,
            reason: "No configured queries.",
          };
        }
        const anyFailures = targets
          .map((target: { query: KairosDBTarget; }) => this.isValidTarget(target.query))
          .filter((resp: ValidatorResponse) => !resp.valid);

        return !_.isEmpty(anyFailures) ? anyFailures[0] : {valid: true};
    }

    public isValidTarget(target: KairosDBTarget): ValidatorResponse {
      if (_.isNil(target) || _.isEmpty(target.metricName)) {
        return {
          valid: false,
          reason: "An active query has no selected metric.",
        };
      }
      if (this.enforceScalarSetting && !target.overrideScalar) {
        if (target.aggregators == null || target.aggregators.length === 0) {
          return {
            valid: false,
            reason: `At least one scalar aggregator required for your query on "${target.metricName}"`
          };
        }

        const valid = target.aggregators.reduce((found, aggregator) => {
          return found || SCALAR_AGGREGATOR_NAMES.indexOf(aggregator.name) !== -1;
        }, false);

        return valid ? {valid} : {
          valid: false,
          reason: `At least one scalar aggregator required for your query on "${target.metricName}".`
        };
      }

      return {
        valid: true,
      };
    }
}
