import { PolicyType } from "../types";
import { PolicyTypeListAction } from "./actions";

export type State = {
    readonly items: PolicyType[];
};

export const defaultState: State = {
    items: [],
};

export const reducer = (state: State = defaultState, action: PolicyTypeListAction): State => {
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
