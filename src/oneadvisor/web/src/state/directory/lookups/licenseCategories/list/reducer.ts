import { LicenseCategoryListState } from "../types";
import { LicenseCategoryListAction } from "./actions";

export const defaultState: LicenseCategoryListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: LicenseCategoryListState = defaultState,
    action: LicenseCategoryListAction
): LicenseCategoryListState => {
    switch (action.type) {
        case "LICENSECATEGORIES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "LICENSECATEGORIES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "LICENSECATEGORIES_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        default:
            return state;
    }
};
