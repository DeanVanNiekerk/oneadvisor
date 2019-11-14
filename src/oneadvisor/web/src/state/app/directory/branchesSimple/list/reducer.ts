import { BranchSimple } from "../types";
import { BranchSimpleListAction } from "./actions";

export type State = {
    readonly items: BranchSimple[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: BranchSimpleListAction): State => {
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
