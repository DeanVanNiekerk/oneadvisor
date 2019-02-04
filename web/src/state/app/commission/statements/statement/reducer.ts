import { ValidationResult } from '@/app/validation';

import { StatementEdit } from '../types';
import { StatementAction } from './actions';

export type State = {
    readonly statement: StatementEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly error: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    statement: null,
    fetching: false,
    updating: false,
    error: false,
    validationResults: []
};

export const reducer = (
    state: State = defaultState,
    action: StatementAction
): State => {
    switch (action.type) {
        case 'STATEMENTS_STATEMENT_RECEIVE': {
            return {
                ...state,
                statement: action.payload,
                fetching: false,
                error: false,
                validationResults: []
            };
        }
        case 'STATEMENTS_STATEMENT_FETCHING': {
            return {
                ...state,
                fetching: true,
                statement: null,
                validationResults: []
            };
        }
        case 'STATEMENTS_STATEMENT_FETCHING_ERROR': {
            return {
                ...state,
                statement: null,
                fetching: false,
                error: true
            };
        }
        case 'STATEMENTS_STATEMENT_EDIT_FETCHING': {
            return {
                ...state,
                updating: true,
                validationResults: []
            };
        }
        case 'STATEMENTS_STATEMENT_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'STATEMENTS_STATEMENT_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'STATEMENTS_STATEMENT_EDIT_VALIDATION_ERROR': {
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
