import { ValidationResult } from '@/app/validation';

import { CommissionErrorEdit } from '../types';
import { CommissionMappingErrorAction } from './actions';

export type State = {
    readonly commissionError: CommissionErrorEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    commissionError: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: State = defaultState,
    action: CommissionMappingErrorAction
): State => {
    switch (action.type) {
        case "COMMISSIONS_ERROR_MAPPING_RECEIVE": {
            return {
                ...state,
                commissionError: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_FETCHING": {
            return {
                ...state,
                fetching: true,
                commissionError: null,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_FETCHING_ERROR": {
            return {
                ...state,
                commissionError: null,
                fetching: false,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_VALIDATION_ERROR": {
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
