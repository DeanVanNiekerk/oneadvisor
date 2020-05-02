import { ResetPasswordState } from "../types";
import { Action } from "./actions";

export const defaultState: ResetPasswordState = {
    fetching: false,
    validationResults: [],
};

export const reducer = (state: ResetPasswordState = defaultState, action: Action) => {
    switch (action.type) {
        case "AUTH_RESETPASSWORD_FETCHING": {
            return {
                ...state,
                fetching: true,
                validationResults: [],
            };
        }
        case "AUTH_RESETPASSWORD_RECEIVE": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_RESETPASSWORD_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_RESETPASSWORD_VALIDATION_ERROR": {
            return {
                ...state,
                fetching: false,
                validationResults: action.payload,
            };
        }
        default:
            return state;
    }
};
