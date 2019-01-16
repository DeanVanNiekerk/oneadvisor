import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { policiesApi } from '@/config/api/member';

import { PolicyEdit } from '../types';

type PolicyReceiveAction = {
    type: 'POLICIES_POLICY_RECEIVE';
    payload: PolicyEdit | null;
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

export const fetchPolicy = (policyId: string): ApiAction => ({
    type: 'API',
    endpoint: `${policiesApi}/${policyId}`,
    dispatchPrefix: 'POLICIES_POLICY'
});

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
