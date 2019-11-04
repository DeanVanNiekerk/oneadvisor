import { PageOptions } from "@/app/table";
import { defaultPageOptions } from "@/app/table/defaults";

import { User } from "../types";
import { UserListAction } from "./actions";

export type State = {
    readonly totalItems: number;
    readonly items: User[];
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
};

export const defaultState: State = {
    totalItems: 0,
    items: [],
    fetching: false,
    pageOptions: defaultPageOptions(),
};

export const reducer = (state: State = defaultState, action: UserListAction): State => {
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
