import { UserTypeListState } from "../types";
import { UserTypeListAction } from "./actions";

export const defaultState: UserTypeListState = {
    items: [],
};

export const reducer = (
    state: UserTypeListState = defaultState,
    action: UserTypeListAction
): UserTypeListState => {
    switch (action.type) {
        case "USERTYPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
