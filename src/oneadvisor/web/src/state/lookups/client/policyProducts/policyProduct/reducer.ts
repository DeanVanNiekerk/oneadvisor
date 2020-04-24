import { PolicyProductState } from "../types";
import { PolicyProductAction } from "./actions";

export const defaultState: PolicyProductState = {
    policyProduct: null,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: PolicyProductState = defaultState,
    action: PolicyProductAction
): PolicyProductState => {
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
