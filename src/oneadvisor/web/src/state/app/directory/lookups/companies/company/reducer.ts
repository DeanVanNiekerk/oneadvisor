import { ValidationResult } from "@/app/validation";

import { CompanyEdit } from "../types";
import { CompanyAction } from "./actions";

export type State = {
    readonly company: CompanyEdit | null;
    readonly companyOriginal: CompanyEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export const defaultState: State = {
    company: null,
    companyOriginal: null,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (state: State = defaultState, action: CompanyAction): State => {
    switch (action.type) {
        case "COMPANIES_COMPANY_RECEIVE": {
            return {
                ...state,
                company: action.payload,
                companyOriginal: action.payload,
                validationResults: [],
            };
        }
        case "COMPANIES_COMPANY_MODIFIED": {
            return {
                ...state,
                company: action.payload,
            };
        }
        case "COMPANIES_COMPANY_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "COMPANIES_COMPANY_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMPANIES_COMPANY_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMPANIES_COMPANY_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "COMPANIES_COMPANY_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
