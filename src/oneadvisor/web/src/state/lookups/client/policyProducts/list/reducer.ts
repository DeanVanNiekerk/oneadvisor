import { PolicyProductListState } from "../types";
import { PolicyProductListAction } from "./actions";

export const defaultState: PolicyProductListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: PolicyProductListState = defaultState,
    action: PolicyProductListAction
): PolicyProductListState => {
    switch (action.type) {
        case "POLICYPRODUCTS_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "POLICYPRODUCTS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "POLICYPRODUCTS_LIST_FETCHING_ERROR": {
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
