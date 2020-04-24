import { AdviceScopeListState } from "../types";
import { AdviceScopeListAction } from "./actions";

export const defaultState: AdviceScopeListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: AdviceScopeListState = defaultState,
    action: AdviceScopeListAction
): AdviceScopeListState => {
    switch (action.type) {
        case "ADVICESCOPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "ADVICESCOPES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "ADVICESCOPES_LIST_FETCHING_ERROR": {
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
