import { ValidationResult } from "@/app/validation";

import { CommissionEdit } from "../types";
import { CommissionAction } from "./actions";

export type State = {
    readonly commission: CommissionEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    commission: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: CommissionAction): State => {
    switch (action.type) {
        case "COMMISSIONS_COMMISSION_RECEIVE": {
            return {
                ...state,
                commission: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "COMMISSIONS_COMMISSION_FETCHING": {
            return {
                ...state,
                fetching: true,
                commission: null,
                validationResults: [],
            };
        }
        case "COMMISSIONS_COMMISSION_FETCHING_ERROR": {
            return {
                ...state,
                commission: null,
                fetching: false,
            };
        }
        case "COMMISSIONS_COMMISSION_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "COMMISSIONS_COMMISSION_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_COMMISSION_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_COMMISSION_EDIT_VALIDATION_ERROR": {
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
