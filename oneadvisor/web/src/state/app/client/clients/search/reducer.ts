import { Client } from "../types";
import { ClientSearchAction } from "./actions";

export type State = {
    readonly items: Client[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: ClientSearchAction): State => {
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
