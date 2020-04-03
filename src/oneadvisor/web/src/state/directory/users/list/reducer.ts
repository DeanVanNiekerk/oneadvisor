import { defaultPageOptions } from "@/app/table/defaults";

import { ListState } from "../types";
import { UserListAction } from "./actions";

export const defaultState: ListState = {
    totalItems: 0,
    items: [],
    fetching: false,
    pageOptions: defaultPageOptions(),
};

export const reducer = (state: ListState = defaultState, action: UserListAction): ListState => {
    switch (action.type) {
        case "USERS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "USERS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "USERS_LIST_FETCHING_ERROR": {
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
