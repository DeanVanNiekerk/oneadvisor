import { ValidationResult } from '@/app/validation';

import { Action } from './actions';

export type State = {
    readonly fetching: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState = {
    fetching: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case "AUTH_RESETPASSWORD_FETCHING": {
            return {
                ...state,
                fetching: true,
                validationResults: [],
            };
        }
        case "AUTH_RESETPASSWORD_RECEIVE": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_RESETPASSWORD_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_RESETPASSWORD_VALIDATION_ERROR": {
            return {
                ...state,
                fetching: false,
                validationResults: action.payload,
            };
        }
        default:
            return state;
    }
};
