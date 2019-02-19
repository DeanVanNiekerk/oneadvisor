import { ValidationResult } from '@/app/validation';

import { CommissionError, CommissionErrorData } from '../types';
import { CommissionErrorAction } from './actions';

export type State = {
    readonly commissionError: CommissionError | null;
    readonly commissionErrorData: CommissionErrorData | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly error: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    commissionError: null,
    commissionErrorData: null,
    fetching: false,
    updating: false,
    error: false,
    validationResults: []
};

export const reducer = (
    state: State = defaultState,
    action: CommissionErrorAction
): State => {
    switch (action.type) {
        case 'COMMISSIONS_ERROR_FORMAT_RECEIVE': {
            return {
                ...state,
                commissionError: action.payload,
                commissionErrorData: action.payload
                    ? JSON.parse(action.payload.data)
                    : null,
                fetching: false,
                error: false,
                validationResults: []
            };
        }
        case 'COMMISSIONS_ERROR_FORMAT_FETCHING': {
            return {
                ...state,
                fetching: true,
                commissionError: null,
                commissionErrorData: null,
                validationResults: []
            };
        }
        case 'COMMISSIONS_ERROR_FORMAT_FETCHING_ERROR': {
            return {
                ...state,
                commissionError: null,
                commissionErrorData: null,
                fetching: false,
                error: true
            };
        }
        case 'COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING': {
            return {
                ...state,
                updating: true,
                validationResults: []
            };
        }
        case 'COMMISSIONS_ERROR_FORMAT_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'COMMISSIONS_ERROR_FORMAT_EDIT_VALIDATION_ERROR': {
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
