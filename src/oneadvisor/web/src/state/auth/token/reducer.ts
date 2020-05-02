import { getToken, setToken } from "@/state/storage";

import { decodeToken } from "../helpers";
import { TokenState } from "../types";
import { TokenActions } from "./actions";

export const defaultState: TokenState = {
    token: getToken(),
    tokenData: decodeToken(getToken()),
};

export const reducer = (state: TokenState = defaultState, action: TokenActions) => {
    switch (action.type) {
        case "AUTH_TOKEN_RECEIVE": {
            setToken(action.payload);
            return {
                ...state,
                token: action.payload,
                tokenData: decodeToken(action.payload),
            };
        }
        default:
            return state;
    }
};
