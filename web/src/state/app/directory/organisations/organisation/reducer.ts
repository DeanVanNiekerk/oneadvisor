import { ValidationResult } from '@/state/types';

import { Organisation } from '../types';
import { Action } from './actions';



export type State = {
    readonly organisation: Organisation | null,
    readonly fetching: boolean,
    readonly updating: boolean,
    readonly error: boolean,
    readonly validationResults: ValidationResult[]
};

export const defaultState: State = {
    organisation: null,
    fetching: false,
    updating: false,
    error: false,
    validationResults: []
};

export const reducer = (state: State = defaultState, action: Action): State => {
    switch (action.type) {
        case 'ORGANISATIONS_ORGANISATION_RECEIVE': {
            return {
                ...state,
                organisation: action.payload,
                validationResults: [],
                fetching: false,
                error: false
            };
        }
        case 'ORGANISATIONS_ORGANISATION_FETCHING': {
            return {
                ...state,
                validationResults: [],
                fetching: true
            };
        }
        case 'ORGANISATIONS_ORGANISATION_FETCHING_ERROR': {
            return {
                ...state,
                organisation: null,
                fetching: false,
                error: true
            };
        }
        case 'ORGANISATIONS_ORGANISATION_EDIT_FETCHING': {
            return {
                ...state,
                updating: true,
                validationResults: []
            };
        }
        case 'ORGANISATIONS_ORGANISATION_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'ORGANISATIONS_ORGANISATION_EDIT_VALIDATION_ERROR': {
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
