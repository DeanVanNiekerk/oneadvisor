import { ValidationResult } from "@/app/validation";

import { PolicyProduct } from "../types";
import { PolicyProductAction } from "./actions";

export type State = {
    readonly policyProduct: PolicyProduct | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    policyProduct: null,
    updating: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: PolicyProductAction): State => {
    switch (action.type) {
        case "POLICYPRODUCTS_POLICYPRODUCT_RECEIVE": {
            return {
                ...state,
                policyProduct: action.payload,
                validationResults: [],
            };
        }
        case "POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "POLICYPRODUCTS_POLICYPRODUCT_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICYPRODUCTS_POLICYPRODUCT_EDIT_VALIDATION_ERROR": {
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
