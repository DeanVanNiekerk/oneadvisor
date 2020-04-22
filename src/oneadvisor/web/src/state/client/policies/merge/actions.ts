import { Dispatch } from "redux";

import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { mergePoliciesApi } from "@/config/api/client";

import { receivePolicyValidationResults } from "../";
import { MergePolicies } from "../types";

type PolicyMergeVisibleAction = {
    type: "POLICIES_MERGE_VISIBLE";
    payload: boolean;
};

type PolicyMergeReceiveAction = {
    type: "POLICIES_MERGE_RECEIVE";
};
type PolicyMergeFetchingAction = {
    type: "POLICIES_MERGE_FETCHING";
};
type PolicyMergeFetchingErrorAction = {
    type: "POLICIES_MERGE_FETCHING_ERROR";
};
type PolicyMergeValidationErrorAction = {
    type: "POLICIES_MERGE_VALIDATION_ERROR";
};

export type PolicyMergeAction =
    | PolicyMergeVisibleAction
    | PolicyMergeReceiveAction
    | PolicyMergeFetchingAction
    | PolicyMergeFetchingErrorAction
    | PolicyMergeValidationErrorAction;

export const policyMergeVisible = (visible: boolean): PolicyMergeVisibleAction => ({
    type: "POLICIES_MERGE_VISIBLE",
    payload: visible,
});

export const mergePolicies = (merge: MergePolicies, onSuccess: ApiOnSuccess): ApiAction => {
    return {
        type: "API",
        method: "POST",
        endpoint: mergePoliciesApi,
        payload: merge,
        dispatchPrefix: "POLICIES_MERGE",
        onSuccess: onSuccess,
        onValidationFailure: (validationResults: ValidationResult[], dispatch: Dispatch) => {
            dispatch(receivePolicyValidationResults(validationResults));
        },
    };
};
