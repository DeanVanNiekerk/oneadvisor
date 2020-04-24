import { PolicyProductTypeState } from "../types";
import { PolicyProductTypeAction } from "./actions";

export const defaultState: PolicyProductTypeState = {
    policyProductType: null,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: PolicyProductTypeState = defaultState,
    action: PolicyProductTypeAction
): PolicyProductTypeState => {
    switch (action.type) {
        case "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_RECEIVE": {
            return {
                ...state,
                policyProductType: action.payload,
                validationResults: [],
            };
        }
        case "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_VALIDATION_ERROR": {
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
