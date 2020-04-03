import { PolicyState } from "../types";
import { PolicyAction } from "./actions";

export const defaultState: PolicyState = {
    policy: null,
    policyOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (state: PolicyState = defaultState, action: PolicyAction): PolicyState => {
    switch (action.type) {
        case "POLICIES_POLICY_RECEIVE": {
            return {
                ...state,
                policy: action.payload,
                policyOriginal: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "POLICIES_POLICY_MODIFIED": {
            return {
                ...state,
                policy: action.payload,
            };
        }
        case "POLICIES_POLICY_FETCHING": {
            return {
                ...state,
                fetching: true,
                policy: null,
                policyOriginal: null,
                validationResults: [],
            };
        }
        case "POLICIES_POLICY_FETCHING_ERROR": {
            return {
                ...state,
                policy: null,
                policyOriginal: null,
                fetching: false,
            };
        }
        case "POLICIES_POLICY_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "POLICIES_POLICY_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICIES_POLICY_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICIES_POLICY_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "POLICIES_POLICY_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
