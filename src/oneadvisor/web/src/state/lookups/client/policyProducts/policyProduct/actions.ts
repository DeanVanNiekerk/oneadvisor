import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { policyProductsApi } from "@/config/api/client";

import { PolicyProductEdit } from "../types";

type PolicyProductReceiveAction = {
    type: "POLICYPRODUCTS_POLICYPRODUCT_RECEIVE";
    payload: PolicyProductEdit;
};

type PolicyProductUpdatedAction = {
    type: "POLICYPRODUCTS_POLICYPRODUCT_EDIT_RECEIVE";
};
type PolicyProductUpdatingAction = {
    type: "POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING";
};
type PolicyProductUpdatingErrorAction = {
    type: "POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING_ERROR";
};
type PolicyProductValidationErrorAction = {
    type: "POLICYPRODUCTS_POLICYPRODUCT_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type PolicyProductAction =
    | PolicyProductReceiveAction
    | PolicyProductUpdatedAction
    | PolicyProductUpdatingAction
    | PolicyProductUpdatingErrorAction
    | PolicyProductValidationErrorAction;

export const receivePolicyProduct = (
    policyProduct: PolicyProductEdit
): PolicyProductReceiveAction => ({
    type: "POLICYPRODUCTS_POLICYPRODUCT_RECEIVE",
    payload: policyProduct,
});

export const updatePolicyProduct = (
    policyProduct: PolicyProductEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyProductsApi}/${policyProduct.id}`,
    method: "POST",
    payload: policyProduct,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYPRODUCTS_POLICYPRODUCT_EDIT",
});

export const insertPolicyProduct = (
    policyProduct: PolicyProductEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyProductsApi}`,
    method: "POST",
    payload: policyProduct,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYPRODUCTS_POLICYPRODUCT_EDIT",
});
