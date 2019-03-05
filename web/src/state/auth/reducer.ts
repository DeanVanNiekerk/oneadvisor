import { ValidationResult } from '@/app/validation';

import { getIdentity, getToken } from '../storage';
import { Identity } from './';
import { Action } from './actions';
import { decodeToken } from './helpers';
import { TokenData } from './types';

export type State = {
    readonly token: string | null;
    readonly tokenData: TokenData | null;
    readonly fetching: boolean;
    readonly validationResults: ValidationResult[];
    readonly signInFailed: boolean;
    readonly identity: Identity | null;
};

export const defaultState = {
    token: getToken(),
    tokenData: decodeToken(getToken()),
    fetching: false,
    validationResults: [],
    signInFailed: false,
    identity: getIdentity(),
};

export const reducer = (state: State = defaultState, action: Action) => {
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
                token: action.payload.token,
                tokenData: decodeToken(action.payload.token),
                identity: action.payload.identity,
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
