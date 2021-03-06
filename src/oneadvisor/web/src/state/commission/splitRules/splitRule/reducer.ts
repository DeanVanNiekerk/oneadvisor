import { SplitRuleState } from "../types";
import { SplitRuleAction } from "./actions";

export const defaultState: SplitRuleState = {
    splitRule: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: SplitRuleState = defaultState,
    action: SplitRuleAction
): SplitRuleState => {
    switch (action.type) {
        case "SPLITRULES_SPLITRULE_RECEIVE": {
            return {
                ...state,
                splitRule: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "SPLITRULES_SPLITRULE_FETCHING": {
            return {
                ...state,
                validationResults: [],
                fetching: true,
            };
        }
        case "SPLITRULES_SPLITRULE_FETCHING_ERROR": {
            return {
                ...state,
                splitRule: null,
                fetching: false,
            };
        }
        case "SPLITRULES_SPLITRULE_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "SPLITRULES_SPLITRULE_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "SPLITRULES_SPLITRULE_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "SPLITRULES_SPLITRULE_EDIT_VALIDATION_ERROR": {
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
