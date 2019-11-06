import { ValidationResult } from "@/app/validation";

import { CommissionEdit } from "../types";
import { CommissionAction } from "./actions";

export type State = {
    readonly commission: CommissionEdit | null;
    readonly commissionOriginal: CommissionEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export const defaultState: State = {
    commission: null,
    commissionOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (state: State = defaultState, action: CommissionAction): State => {
    switch (action.type) {
        case "COMMISSIONS_COMMISSION_RECEIVE": {
            return {
                ...state,
                commission: action.payload,
                commissionOriginal: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "COMMISSIONS_COMMISSION_MODIFIED": {
            return {
                ...state,
                commission: action.payload,
            };
        }
        case "COMMISSIONS_COMMISSION_FETCHING": {
            return {
                ...state,
                fetching: true,
                commission: null,
                commissionOriginal: null,
                validationResults: [],
            };
        }
        case "COMMISSIONS_COMMISSION_FETCHING_ERROR": {
            return {
                ...state,
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
        case "COMMISSIONS_COMMISSION_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
