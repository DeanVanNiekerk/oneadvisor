import { SplitRulePolicyState } from "../types";
import { SplitRulePolicyAction } from "./actions";

export const defaultState: SplitRulePolicyState = {
    splitRulePolicy: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: SplitRulePolicyState = defaultState,
    action: SplitRulePolicyAction
): SplitRulePolicyState => {
    switch (action.type) {
        case "SPLITRULEPOLICIES_SPLITRULEPOLICY_RECEIVE": {
            return {
                ...state,
                splitRulePolicy: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING": {
            return {
                ...state,
                validationResults: [],
                fetching: true,
            };
        }
        case "SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING_ERROR": {
            return {
                ...state,
                splitRulePolicy: null,
                fetching: false,
            };
        }
        case "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        default:
            return state;
    }
};
