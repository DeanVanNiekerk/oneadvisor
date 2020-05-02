import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation/types";
import { splitRulesApi } from "@/config/api/commission";

import { SplitRuleEdit } from "../types";

type SplitRuleReceiveAction = {
    type: "SPLITRULES_SPLITRULE_RECEIVE";
    payload: SplitRuleEdit | null;
};
type SplitRuleFetchingAction = {
    type: "SPLITRULES_SPLITRULE_FETCHING";
};
type SplitRuleFetchingErrorAction = {
    type: "SPLITRULES_SPLITRULE_FETCHING_ERROR";
};

type SplitRuleUpdatedAction = {
    type: "SPLITRULES_SPLITRULE_EDIT_RECEIVE";
};
type SplitRuleUpdatingAction = {
    type: "SPLITRULES_SPLITRULE_EDIT_FETCHING";
};
type SplitRuleUpdatingErrorAction = {
    type: "SPLITRULES_SPLITRULE_EDIT_FETCHING_ERROR";
};
type SplitRuleValidationErrorAction = {
    type: "SPLITRULES_SPLITRULE_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type SplitRuleAction =
    | SplitRuleReceiveAction
    | SplitRuleFetchingAction
    | SplitRuleFetchingErrorAction
    | SplitRuleUpdatedAction
    | SplitRuleUpdatingAction
    | SplitRuleUpdatingErrorAction
    | SplitRuleValidationErrorAction;

export const receiveSplitRule = (splitRule: SplitRuleEdit | null): SplitRuleReceiveAction => ({
    type: "SPLITRULES_SPLITRULE_RECEIVE",
    payload: splitRule,
});

export const fetchSplitRule = (splitRuleId: string): ApiAction => ({
    type: "API",
    endpoint: `${splitRulesApi}/${splitRuleId}`,
    dispatchPrefix: "SPLITRULES_SPLITRULE",
});

export const updateSplitRule = (splitRule: SplitRuleEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${splitRulesApi}/${splitRule.id}`,
    method: "POST",
    payload: splitRule,
    onSuccess: onSuccess,
    dispatchPrefix: "SPLITRULES_SPLITRULE_EDIT",
});

export const insertSplitRule = (splitRule: SplitRuleEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${splitRulesApi}`,
    method: "POST",
    payload: splitRule,
    onSuccess: onSuccess,
    dispatchPrefix: "SPLITRULES_SPLITRULE_EDIT",
});

export const deleteSplitRule = (splitRuleId: string, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${splitRulesApi}/${splitRuleId}`,
    method: "DELETE",
    onSuccess: onSuccess,
});
