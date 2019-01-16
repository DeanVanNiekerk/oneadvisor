import { ValidationResult } from '@/app/validation';

import { PolicyEdit } from '../types';
import { PolicyAction } from './actions';

export type State = {
    readonly policy: PolicyEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly error: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    policy: null,
    fetching: false,
    updating: false,
    error: false,
    validationResults: []
};

export const reducer = (
    state: State = defaultState,
    action: PolicyAction
): State => {
    switch (action.type) {
        case 'POLICIES_POLICY_RECEIVE': {
            return {
                ...state,
                policy: action.payload,
                fetching: false,
                error: false,
                validationResults: []
            };
        }
        case 'POLICIES_POLICY_FETCHING': {
            return {
                ...state,
                fetching: true,
                policy: null,
                validationResults: []
            };
        }
        case 'POLICIES_POLICY_FETCHING_ERROR': {
            return {
                ...state,
                policy: null,
                fetching: false,
                error: true
            };
        }
        case 'POLICIES_POLICY_EDIT_FETCHING': {
            return {
                ...state,
                updating: true,
                validationResults: []
            };
        }
        case 'POLICIES_POLICY_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'POLICIES_POLICY_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'POLICIES_POLICY_EDIT_VALIDATION_ERROR': {
            return {
                ...state,
                updating: false,
                validationResults: action.payload
            };
        }
        default:
            return state;
    }
};
