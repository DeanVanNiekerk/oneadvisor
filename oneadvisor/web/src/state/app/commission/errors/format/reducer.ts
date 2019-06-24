import { ValidationResult } from '@/app/validation';

import { CommissionErrorEdit, CommissionImportData } from '../types';
import { CommissionFormatErrorAction } from './actions';

export type State = {
    readonly commissionError: CommissionErrorEdit | null;
    readonly commissionErrorData: CommissionImportData | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    commissionError: null,
    commissionErrorData: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: State = defaultState,
    action: CommissionFormatErrorAction
): State => {
    switch (action.type) {
        case "COMMISSIONS_ERROR_FORMAT_RECEIVE": {
            return {
                ...state,
                commissionError: action.payload,
                commissionErrorData: action.payload
                    ? action.payload.data
                    : null,
                fetching: false,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_FORMAT_FETCHING": {
            return {
                ...state,
                fetching: true,
                commissionError: null,
                commissionErrorData: null,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_FORMAT_FETCHING_ERROR": {
            return {
                ...state,
                commissionError: null,
                commissionErrorData: null,
                fetching: false,
            };
        }
        case "COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_FORMAT_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_ERROR_FORMAT_EDIT_VALIDATION_ERROR": {
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
