import { UserSimpleState } from "../types";
import { UserSimpleAction } from "./actions";

export const defaultState: UserSimpleState = {
    userSimple: null,
    fetching: false,
};

export const reducer = (
    state: UserSimpleState = defaultState,
    action: UserSimpleAction
): UserSimpleState => {
    switch (action.type) {
        case "USERSSIMPLE_USER_RECEIVE": {
            return {
                ...state,
                userSimple: action.payload,
                fetching: false,
            };
        }
        case "USERSSIMPLE_USER_FETCHING": {
            return {
                ...state,
                fetching: true,
                userSimple: null,
            };
        }
        case "USERSSIMPLE_USER_FETCHING_ERROR": {
            return {
                ...state,
                userSimple: null,
                fetching: false,
            };
        }
        default:
            return state;
    }
};
