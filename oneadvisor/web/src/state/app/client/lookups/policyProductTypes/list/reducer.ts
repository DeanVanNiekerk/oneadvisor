import { PolicyProductType } from "../types";
import { PolicyProductTypeListAction } from "./actions";

export type State = {
    readonly items: PolicyProductType[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: PolicyProductTypeListAction): State => {
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
