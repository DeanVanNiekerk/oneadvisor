import { ListState } from "../types";
import { SplitRuleListAction } from "./actions";

export const defaultState: ListState = {
    totalItems: 0,
    items: [],
    fetching: false,
    pageOptions: { number: 0, size: 0 },
};

export const reducer = (
    state: ListState = defaultState,
    action: SplitRuleListAction
): ListState => {
    switch (action.type) {
        case "SPLITRULES_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "SPLITRULES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "SPLITRULES_LIST_FETCHING_ERROR": {
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
