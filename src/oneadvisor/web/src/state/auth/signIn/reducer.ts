import { SignInState } from "../types";
import { SignInActions } from "./actions";

export const defaultState: SignInState = {
    fetching: false,
    validationResults: [],
    signInFailed: false,
};

export const reducer = (state: SignInState = defaultState, action: SignInActions) => {
    switch (action.type) {
        case "AUTH_SIGNIN_FETCHING": {
            return {
                ...state,
                fetching: true,
                validationResults: [],
                signInFailed: false,
            };
        }
        case "AUTH_SIGNIN_RECEIVE": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_SIGNIN_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "AUTH_SIGNIN_VALIDATION_ERROR": {
            return {
                ...state,
                fetching: false,
                validationResults: action.payload,
                signInFailed: true,
            };
        }
        default:
            return state;
    }
};
