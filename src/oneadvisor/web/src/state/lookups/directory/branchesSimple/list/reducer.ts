import { BranchesSimpleListState } from "../types";
import { BranchSimpleListAction } from "./actions";

export const defaultState: BranchesSimpleListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: BranchesSimpleListState = defaultState,
    action: BranchSimpleListAction
): BranchesSimpleListState => {
    switch (action.type) {
        case "BRANCHESSIMPLE_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "BRANCHESSIMPLE_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "BRANCHESSIMPLE_LIST_FETCHING_ERROR": {
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
