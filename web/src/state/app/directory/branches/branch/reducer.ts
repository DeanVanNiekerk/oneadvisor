import { ValidationResult } from '@/app/validation';

import { Branch } from '../types';
import { BranchAction } from './actions';

export type State = {
    readonly branch: Branch | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly error: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    branch: null,
    fetching: false,
    updating: false,
    error: false,
    validationResults: []
};

export const reducer = (
    state: State = defaultState,
    action: BranchAction
): State => {
    switch (action.type) {
        case 'BRANCHES_BRANCH_RECEIVE': {
            return {
                ...state,
                branch: action.payload,
                validationResults: [],
                fetching: false,
                error: false
            };
        }
        case 'BRANCHES_BRANCH_FETCHING': {
            return {
                ...state,
                validationResults: [],
                fetching: true
            };
        }
        case 'BRANCHES_BRANCH_FETCHING_ERROR': {
            return {
                ...state,
                branch: null,
                fetching: false,
                error: true
            };
        }
        case 'BRANCHES_BRANCH_EDIT_FETCHING': {
            return {
                ...state,
                updating: true,
                validationResults: []
            };
        }
        case 'BRANCHES_BRANCH_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'BRANCHES_BRANCH_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'BRANCHES_BRANCH_EDIT_VALIDATION_ERROR': {
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
