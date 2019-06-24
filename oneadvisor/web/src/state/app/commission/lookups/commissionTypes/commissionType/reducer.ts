import { ValidationResult } from '@/app/validation';

import { CommissionType } from '../types';
import { CommissionTypeAction } from './actions';

export type State = {
    readonly commissionType: CommissionType | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    commissionType: null,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: State = defaultState,
    action: CommissionTypeAction
): State => {
    switch (action.type) {
        case "COMMISSIONTYPES_COMMISSIONTYPE_RECEIVE": {
            return {
                ...state,
                commissionType: action.payload,
                validationResults: [],
            };
        }
        case "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_VALIDATION_ERROR": {
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
