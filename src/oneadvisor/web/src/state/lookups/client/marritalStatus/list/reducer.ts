import { MarritalStatusListState } from "../types";
import { MarritalStatusListAction } from "./actions";

export const defaultState: MarritalStatusListState = {
    items: [],
};

export const reducer = (
    state: MarritalStatusListState = defaultState,
    action: MarritalStatusListAction
): MarritalStatusListState => {
    switch (action.type) {
        case "MARRITALSTATUS_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
