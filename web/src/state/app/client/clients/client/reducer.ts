import { ValidationResult } from '@/app/validation';

import { ClientEdit } from '../types';
import { ClientAction } from './actions';

export type State = {
    readonly client: ClientEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    client: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: State = defaultState,
    action: ClientAction
): State => {
    switch (action.type) {
        case "CLIENTS_CLIENT_RECEIVE": {
            return {
                ...state,
                client: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "CLIENTS_CLIENT_FETCHING": {
            return {
                ...state,
                fetching: true,
                client: null,
                validationResults: [],
            };
        }
        case "CLIENTS_CLIENT_FETCHING_ERROR": {
            return {
                ...state,
                client: null,
                fetching: false,
            };
        }
        case "CLIENTS_CLIENT_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "CLIENTS_CLIENT_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CLIENTS_CLIENT_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CLIENTS_CLIENT_EDIT_VALIDATION_ERROR": {
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