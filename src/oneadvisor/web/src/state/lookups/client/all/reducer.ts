import { LookupsAction } from "./actions";
import { AllLookupsState } from "./types";

export const defaultState: AllLookupsState = {
    fetching: true, //Default to true as we always load on startup
};

export const reducer = (
    state: AllLookupsState = defaultState,
    action: LookupsAction
): AllLookupsState => {
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
