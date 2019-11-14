import { ValidationResult } from "@/app/validation";

import { CommissionStatementTemplateEdit } from "../types";
import { TemplateAction } from "./actions";

export type State = {
    readonly template: CommissionStatementTemplateEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    template: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: TemplateAction): State => {
    switch (action.type) {
        case "COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE": {
            return {
                ...state,
                template: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_FETCHING": {
            return {
                ...state,
                fetching: true,
                template: null,
                validationResults: [],
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_FETCHING_ERROR": {
            return {
                ...state,
                template: null,
                fetching: false,
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_VALIDATION_ERROR": {
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
