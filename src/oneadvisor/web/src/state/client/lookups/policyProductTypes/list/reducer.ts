import { PolicyProductTypeListState } from "../types";
import { PolicyProductTypeListAction } from "./actions";

export const defaultState: PolicyProductTypeListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: PolicyProductTypeListState = defaultState,
    action: PolicyProductTypeListAction
): PolicyProductTypeListState => {
    switch (action.type) {
        case "POLICYPRODUCTTYPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "POLICYPRODUCTTYPES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "POLICYPRODUCTTYPES_LIST_FETCHING_ERROR": {
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
