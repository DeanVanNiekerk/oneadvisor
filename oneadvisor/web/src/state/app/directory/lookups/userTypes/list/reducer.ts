import { UserType } from "../types";
import { UserTypeListAction } from "./actions";

export type State = {
    readonly items: UserType[];
};

export const defaultState: State = {
    items: [],
};

export const reducer = (
    state: State = defaultState,
    action: UserTypeListAction
): State => {
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
