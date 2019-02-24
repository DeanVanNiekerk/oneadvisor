import { ValidationResult } from '@/app/validation';

import { getIdentity, getToken } from '../storage';
import { Identity } from './';
import { Action } from './actions';

export type State = {
    readonly authenticated: boolean;
    readonly token: string | null;
    readonly fetching: boolean;
    readonly error: boolean;
    readonly validationResults: ValidationResult[];
    readonly signInFailed: boolean;
    readonly identity: Identity | null;
};

export const defaultState = {
    authenticated: false,
    token: getToken(),
    fetching: false,
    error: false,
    validationResults: [],
    signInFailed: false,
    identity: getIdentity()
};

export const reducer = (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'AUTH_SIGNIN_FETCHING': {
            return {
                ...state,
                fetching: true,
                validationResults: [],
                signInFailed: false
            };
        }
        case 'AUTH_SIGNIN_RECEIVE': {
            return {
                ...state,
                fetching: false,
                token: action.payload.token
            };
        }
        case 'AUTH_SIGNIN_FETCHING_ERROR': {
            return {
                ...state,
                fetching: false,
                error: true
            };
        }
        case 'AUTH_SIGNIN_VALIDATION_ERROR': {
            return {
                ...state,
                fetching: false,
                validationResults: action.payload
            };
        }
        case 'AUTH_SIGNIN_FAILED': {
            return {
                ...state,
                fetching: false,
                signInFailed: true
            };
        }
        default:
            return state;
    }
};
