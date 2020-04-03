import { SearchState } from "../types";
import { ClientSearchAction } from "./actions";

export const defaultState: SearchState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: SearchState = defaultState,
    action: ClientSearchAction
): SearchState => {
    switch (action.type) {
        case "CLIENTS_SEARCH_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "CLIENTS_SEARCH_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "CLIENTS_SEARCH_FETCHING_ERROR": {
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
