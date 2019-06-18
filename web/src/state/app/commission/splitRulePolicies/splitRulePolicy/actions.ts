import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { splitRulePoliciesApi } from '@/config/api/commission';

import { SplitRulePolicy } from '../types';

type SplitRulePolicyReceiveAction = {
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_RECEIVE";
    payload: SplitRulePolicy | null;
};
type SplitRulePolicyFetchingAction = {
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING";
};
type SplitRulePolicyFetchingErrorAction = {
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING_ERROR";
};

type SplitRulePolicyUpdatedAction = {
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_RECEIVE";
};
type SplitRulePolicyUpdatingAction = {
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING";
};
type SplitRulePolicyUpdatingErrorAction = {
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING_ERROR";
};
type SplitRulePolicyValidationErrorAction = {
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type SplitRulePolicyAction =
    | SplitRulePolicyReceiveAction
    | SplitRulePolicyFetchingAction
    | SplitRulePolicyFetchingErrorAction
    | SplitRulePolicyUpdatedAction
    | SplitRulePolicyUpdatingAction
    | SplitRulePolicyUpdatingErrorAction
    | SplitRulePolicyValidationErrorAction;

export const receiveSplitRulePolicy = (splitRulePolicy: SplitRulePolicy | null): SplitRulePolicyReceiveAction => ({
    type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_RECEIVE",
    payload: splitRulePolicy,
});

export const fetchSplitRulePolicy = (policyId: string): ApiAction => ({
    type: "API",
    endpoint: `${splitRulePoliciesApi}/${policyId}`,
    dispatchPrefix: "SPLITRULEPOLICIES_SPLITRULEPOLICY",
});

export const updateSplitRulePolicy = (splitRulePolicy: SplitRulePolicy, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${splitRulePoliciesApi}/${splitRulePolicy.id}`,
    method: "POST",
    payload: splitRulePolicy,
    onSuccess: onSuccess,
    dispatchPrefix: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT",
});

export const insertSplitRulePolicy = (splitRulePolicy: SplitRulePolicy, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${splitRulePoliciesApi}`,
    method: "POST",
    payload: splitRulePolicy,
    onSuccess: onSuccess,
    dispatchPrefix: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT",
});

export const deleteSplitRulePolicy = (splitRulePolicyId: string, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${splitRulePoliciesApi}/${splitRulePolicyId}`,
    method: "DELETE",
    onSuccess: onSuccess,
});
