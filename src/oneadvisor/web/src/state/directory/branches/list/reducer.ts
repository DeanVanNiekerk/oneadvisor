import { ListState } from "../types";
import { BranchListAction } from "./actions";

export const defaultState: ListState = {
    items: [],
    fetching: false,
};

export const reducer = (state: ListState = defaultState, action: BranchListAction): ListState => {
    switch (action.type) {
        case "BRANCHES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "BRANCHES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "BRANCHES_LIST_FETCHING_ERROR": {
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
