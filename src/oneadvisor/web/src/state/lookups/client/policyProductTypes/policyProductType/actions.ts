import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation/types";
import { policyProductTypesApi } from "@/config/api/client";

import { PolicyProductTypeEdit } from "../types";

type PolicyProductTypeReceiveAction = {
    type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_RECEIVE";
    payload: PolicyProductTypeEdit;
};

type PolicyProductTypeUpdatedAction = {
    type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_RECEIVE";
};
type PolicyProductTypeUpdatingAction = {
    type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING";
};
type PolicyProductTypeUpdatingErrorAction = {
    type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING_ERROR";
};
type PolicyProductTypeValidationErrorAction = {
    type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type PolicyProductTypeAction =
    | PolicyProductTypeReceiveAction
    | PolicyProductTypeUpdatedAction
    | PolicyProductTypeUpdatingAction
    | PolicyProductTypeUpdatingErrorAction
    | PolicyProductTypeValidationErrorAction;

export const receivePolicyProductType = (
    policyProductType: PolicyProductTypeEdit
): PolicyProductTypeReceiveAction => ({
    type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_RECEIVE",
    payload: policyProductType,
});

export const updatePolicyProductType = (
    policyProductType: PolicyProductTypeEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyProductTypesApi}/${policyProductType.id}`,
    method: "POST",
    payload: policyProductType,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT",
});

export const insertPolicyProductType = (
    policyProductType: PolicyProductTypeEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyProductTypesApi}`,
    method: "POST",
    payload: policyProductType,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT",
});
