import { ListState } from "../types";
import { RoleListAction } from "./actions";

export const defaultState: ListState = {
    items: [],
    fetching: false,
};

export const reducer = (state: ListState = defaultState, action: RoleListAction): ListState => {
    switch (action.type) {
        case "ROLES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "ROLES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "ROLES_LIST_FETCHING_ERROR": {
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
