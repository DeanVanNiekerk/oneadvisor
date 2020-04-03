import { ListState } from "../types";
import { OrganisationListAction } from "./actions";

export const defaultState: ListState = {
    totalItems: 0,
    items: [],
    fetching: false,
};

export const reducer = (
    state: ListState = defaultState,
    action: OrganisationListAction
): ListState => {
    switch (action.type) {
        case "ORGANISATIONS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "ORGANISATIONS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "ORGANISATIONS_LIST_FETCHING_ERROR": {
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
