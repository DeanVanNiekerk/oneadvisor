import { ValidationResult } from '@/app/validation';

import { SplitRulePolicy } from '../types';
import { SplitRulePolicyAction } from './actions';

export type State = {
    readonly splitRulePolicy: SplitRulePolicy | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    splitRulePolicy: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: SplitRulePolicyAction): State => {
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
