import { Policy } from "../types";
import { PolicySearchAction } from "./actions";

export type State = {
    readonly items: Policy[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: PolicySearchAction): State => {
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
