import { ValidationResult } from "@/app/validation";

import { CommissionStatementTemplateEdit } from "../types";
import { TemplateAction } from "./actions";

export type State = {
    readonly template: CommissionStatementTemplateEdit | null;
    readonly templateOriginal: CommissionStatementTemplateEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export const defaultState: State = {
    template: null,
    templateOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (state: State = defaultState, action: TemplateAction): State => {
    switch (action.type) {
        case "COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE": {
            return {
                ...state,
                template: action.payload,
                templateOriginal: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_MODIFIED": {
            return {
                ...state,
                template: action.payload,
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATE_FETCHING": {
            return {
                ...state,
                fetching: true,
                template: null,
                templateOriginal: null,
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
        case "COMMISSIONS_STATEMENT_TEMPLATE_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
