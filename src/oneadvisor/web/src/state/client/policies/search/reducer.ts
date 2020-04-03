import { SearchState } from "../types";
import { PolicySearchAction } from "./actions";

export const defaultState: SearchState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: SearchState = defaultState,
    action: PolicySearchAction
): SearchState => {
    switch (action.type) {
        case "POLICIES_SEARCH_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "POLICIES_SEARCH_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "POLICIES_SEARCH_FETCHING_ERROR": {
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
