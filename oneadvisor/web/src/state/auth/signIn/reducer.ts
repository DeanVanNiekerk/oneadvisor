import { ValidationResult } from '@/app/validation';

import { SignInActions } from './actions';

export type State = {
    readonly fetching: boolean;
    readonly validationResults: ValidationResult[];
    readonly signInFailed: boolean;
};

export const defaultState = {
    fetching: false,
    validationResults: [],
    signInFailed: false,
};

export const reducer = (state: State = defaultState, action: SignInActions) => {
    switch (action.type) {
        case "AUTH_SIGNIN_FETCHING": {
            return {
                ...state,
                fetching: true,
                validationResults: [],
                signInFailed: false,
            };
        }
        case "AUTH_SIGNIN_RECEIVE": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_SIGNIN_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_SIGNIN_VALIDATION_ERROR": {
            return {
                ...state,
                fetching: false,
                validationResults: action.payload,
                signInFailed: true,
            };
        }
        default:
            return state;
    }
};
