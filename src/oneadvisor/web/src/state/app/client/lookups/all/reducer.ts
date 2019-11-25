import { LookupsAction } from "./actions";

export type State = {
    readonly fetching: boolean;
};

export const defaultState: State = {
    fetching: true, //Default to true as we always load on startup
};

export const reducer = (state: State = defaultState, action: LookupsAction): State => {
    switch (action.type) {
        case "CLIENT_LOOKUPS_RECEIVE": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "CLIENT_LOOKUPS_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "CLIENT_LOOKUPS_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        default:
            return state;
    }
};