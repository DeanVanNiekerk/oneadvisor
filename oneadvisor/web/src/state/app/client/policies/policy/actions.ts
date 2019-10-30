import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { policiesApi } from "@/config/api/client";
import { RootState } from "@/state/rootReducer";

import { createPolicy, policyIsModifiedSelector, policySelector } from "../";
import { PolicyEdit } from "../types";

type PolicyReceiveAction = {
    type: 'POLICIES_POLICY_RECEIVE';
    payload: PolicyEdit | null;
};
type PolicyModifiedAction = {
    type: "POLICIES_POLICY_MODIFIED";
    payload: PolicyEdit | null;
};
type PolicyVisibleAction = {
    type: "POLICIES_POLICY_VISIBLE";
    payload: boolean;
};
type PolicyFetchingAction = { type: 'POLICIES_POLICY_FETCHING' };
type PolicyFetchingErrorAction = { type: 'POLICIES_POLICY_FETCHING_ERROR' };

type PolicyUpdatedAction = { type: 'POLICIES_POLICY_EDIT_RECEIVE' };
type PolicyUpdatingAction = { type: 'POLICIES_POLICY_EDIT_FETCHING' };
type PolicyUpdatingErrorAction = {
    type: 'POLICIES_POLICY_EDIT_FETCHING_ERROR';
};
type PolicyValidationErrorAction = {
    type: 'POLICIES_POLICY_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type PolicyAction =
    | PolicyModifiedAction
    | PolicyVisibleAction
    | PolicyReceiveAction
    | PolicyFetchingAction
    | PolicyFetchingErrorAction
    | PolicyUpdatedAction
    | PolicyUpdatingAction
    | PolicyUpdatingErrorAction
    | PolicyValidationErrorAction;

export const receivePolicy = (
    policy: PolicyEdit | null
): PolicyReceiveAction => ({
    type: 'POLICIES_POLICY_RECEIVE',
    payload: policy
});

export const getPolicy = (
    policyId: string,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${policiesApi}/${policyId}`,
    onSuccess: onSuccess
});

export const fetchPolicy = (policyId: string): ApiAction => ({
    type: 'API',
    endpoint: `${policiesApi}/${policyId}`,
    dispatchPrefix: 'POLICIES_POLICY'
});

export const modifyPolicy = (policy: PolicyEdit): PolicyModifiedAction => ({
    type: 'POLICIES_POLICY_MODIFIED',
    payload: policy
});

export const policyVisible = (visible: boolean): PolicyVisibleAction => ({
    type: "POLICIES_POLICY_VISIBLE",
    payload: visible,
});

export const clearPolicy = (): PolicyReceiveAction => receivePolicy(null);

export const newPolicy = (policy?: Partial<PolicyEdit>): PolicyReceiveAction => receivePolicy(createPolicy(policy));

export const savePolicy = (onSaved?: (policy: PolicyEdit) => void): ThunkAction<void, RootState, {}, PolicyReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { policy } = policySelector(getState());
        if (!policy) return;

        const onSuccess = (policyEdit: PolicyEdit) => {
            dispatch(clearPolicy());
            if (onSaved) onSaved(policyEdit);
        }

        if (policy.id) {
            dispatch(updatePolicy(policy, () => {
                onSuccess(policy);
            }));
        } else {
            dispatch(insertPolicy(policy, (result) => {
                onSuccess(result.tag);
            }));
        }
    };
}

export const confirmCancelPolicy = (showConfirm: ShowConfirm, onCancelled: () => void): ThunkAction<void, RootState, {}, PolicyReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = policyIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearPolicy());
            onCancelled();
        }

        if (modifed)
            return showConfirm({ onOk: () => { cancel(); } });

        cancel();
    };
}

export const updatePolicy = (
    policy: PolicyEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${policiesApi}/${policy.id}`,
    method: 'POST',
    payload: policy,
    onSuccess: onSuccess,
    dispatchPrefix: 'POLICIES_POLICY_EDIT'
});

export const insertPolicy = (
    policy: PolicyEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${policiesApi}`,
    method: 'POST',
    payload: policy,
    onSuccess: onSuccess,
    dispatchPrefix: 'POLICIES_POLICY_EDIT'
});
