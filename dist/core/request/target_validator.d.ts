import { KairosDBTarget } from "../../beans/request/target";
export declare type ValidatorResponse = ValidatorSuccessResponse | ValidatorFailureResponse;
export interface ValidatorSuccessResponse {
    valid: true;
}
export interface ValidatorFailureResponse {
    valid: false;
    reason: string;
}
export declare class TargetValidator {
    private enforceScalarSetting;
    constructor(enforceScalarSetting: any);
    areValidTargets(targets: any): ValidatorResponse;
    isValidTarget(target: KairosDBTarget): ValidatorResponse;
}
