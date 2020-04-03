import { ListState } from "../types";
import { ApplicationListAction } from "./actions";

export const defaultState: ListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: ListState = defaultState,
    action: ApplicationListAction
): ListState => {
    switch (action.type) {
        case "APPLICATIONS_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "APPLICATIONS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "APPLICATIONS_LIST_FETCHING_ERROR": {
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
