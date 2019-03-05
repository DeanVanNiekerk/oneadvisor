import { ValidationResult } from '@/app/validation';

import { UserEdit } from '../types';
import { UserAction } from './actions';

export type State = {
    readonly user: UserEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    user: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: State = defaultState,
    action: UserAction
): State => {
    switch (action.type) {
        case "USERS_USER_RECEIVE": {
            return {
                ...state,
                user: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "USERS_USER_FETCHING": {
            return {
                ...state,
                fetching: true,
                user: null,
                validationResults: [],
            };
        }
        case "USERS_USER_FETCHING_ERROR": {
            return {
                ...state,
                user: null,
                fetching: false,
            };
        }
        case "USERS_USER_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "USERS_USER_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "USERS_USER_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "USERS_USER_EDIT_VALIDATION_ERROR": {
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
