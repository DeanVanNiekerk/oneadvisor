import { ValidationResult } from '@/app/validation';

import { Company } from '../types';
import { CompanyAction } from './actions';

export type State = {
    readonly company: Company | null;
    readonly updating: boolean;
    readonly error: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    company: null,
    updating: false,
    error: false,
    validationResults: []
};

export const reducer = (
    state: State = defaultState,
    action: CompanyAction
): State => {
    switch (action.type) {
        case 'COMPANIES_COMPANY_RECEIVE': {
            return {
                ...state,
                company: action.payload,
                validationResults: [],
                error: false
            };
        }
        case 'COMPANIES_COMPANY_EDIT_FETCHING': {
            return {
                ...state,
                updating: true,
                validationResults: []
            };
        }
        case 'COMPANIES_COMPANY_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'COMPANIES_COMPANY_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'COMPANIES_COMPANY_EDIT_VALIDATION_ERROR': {
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
