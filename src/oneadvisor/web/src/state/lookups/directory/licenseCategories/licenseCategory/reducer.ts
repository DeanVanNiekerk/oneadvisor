import { LicenseCategoryState } from "../types";
import { LicenseCategoryAction } from "./actions";

export const defaultState: LicenseCategoryState = {
    licenseCategory: null,
    licenseCategoryOriginal: null,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (
    state: LicenseCategoryState = defaultState,
    action: LicenseCategoryAction
): LicenseCategoryState => {
    switch (action.type) {
        case "LICENSECATEGORIES_LICENSECATEGORY_RECEIVE": {
            return {
                ...state,
                licenseCategory: action.payload,
                licenseCategoryOriginal: action.payload,
                validationResults: [],
            };
        }
        case "LICENSECATEGORIES_LICENSECATEGORY_MODIFIED": {
            return {
                ...state,
                licenseCategory: action.payload,
            };
        }
        case "LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "LICENSECATEGORIES_LICENSECATEGORY_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "LICENSECATEGORIES_LICENSECATEGORY_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "LICENSECATEGORIES_LICENSECATEGORY_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
