import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { policyTypeCharacteristicsApi } from "@/config/api/client";

import { PolicyTypeCharacteristicEdit } from "../types";

type PolicyTypeCharacteristicReceiveAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_RECEIVE";
    payload: PolicyTypeCharacteristicEdit;
};

type PolicyTypeCharacteristicUpdatedAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_RECEIVE";
};
type PolicyTypeCharacteristicUpdatingAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING";
};
type PolicyTypeCharacteristicUpdatingErrorAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING_ERROR";
};
type PolicyTypeCharacteristicValidationErrorAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type PolicyTypeCharacteristicAction =
    | PolicyTypeCharacteristicReceiveAction
    | PolicyTypeCharacteristicUpdatedAction
    | PolicyTypeCharacteristicUpdatingAction
    | PolicyTypeCharacteristicUpdatingErrorAction
    | PolicyTypeCharacteristicValidationErrorAction;

export const receivePolicyTypeCharacteristic = (
    policyTypeCharacteristic: PolicyTypeCharacteristicEdit
): PolicyTypeCharacteristicReceiveAction => ({
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_RECEIVE",
    payload: policyTypeCharacteristic,
});

export const updatePolicyTypeCharacteristic = (
    policyTypeCharacteristic: PolicyTypeCharacteristicEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyTypeCharacteristicsApi}/${policyTypeCharacteristic.id}`,
    method: "POST",
    payload: policyTypeCharacteristic,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT",
});

export const insertPolicyTypeCharacteristic = (
    policyTypeCharacteristic: PolicyTypeCharacteristicEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyTypeCharacteristicsApi}`,
    method: "POST",
    payload: policyTypeCharacteristic,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT",
});
