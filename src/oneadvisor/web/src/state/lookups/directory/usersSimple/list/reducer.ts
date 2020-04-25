import { UserSimpleListState } from "../types";
import { UserSimpleListAction } from "./actions";

export const defaultState: UserSimpleListState = {
    totalItems: 0,
    items: [],
    fetching: false,
};

export const reducer = (
    state: UserSimpleListState = defaultState,
    action: UserSimpleListAction
): UserSimpleListState => {
    switch (action.type) {
        case "USERSSIMPLE_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "USERSSIMPLE_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "USERSSIMPLE_LIST_FETCHING_ERROR": {
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
