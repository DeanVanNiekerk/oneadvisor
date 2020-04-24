import { CompanyListState } from "../types";
import { CompanyListAction } from "./actions";

export const defaultState: CompanyListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: CompanyListState = defaultState,
    action: CompanyListAction
): CompanyListState => {
    switch (action.type) {
        case "COMPANIES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "COMPANIES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMPANIES_LIST_FETCHING_ERROR": {
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
