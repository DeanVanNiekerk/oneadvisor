import { PolicyTypeListState } from "../types";
import { PolicyTypeListAction } from "./actions";

export const defaultState: PolicyTypeListState = {
    items: [],
};

export const reducer = (
    state: PolicyTypeListState = defaultState,
    action: PolicyTypeListAction
): PolicyTypeListState => {
    switch (action.type) {
        case "POLICYTYPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
