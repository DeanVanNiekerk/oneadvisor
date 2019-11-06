import { UserSimple } from "../types";
import { UserSimpleListAction } from "./actions";

export type State = {
    readonly totalItems: number;
    readonly items: UserSimple[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    totalItems: 0,
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: UserSimpleListAction): State => {
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
