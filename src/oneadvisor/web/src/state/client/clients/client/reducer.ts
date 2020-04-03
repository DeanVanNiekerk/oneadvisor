import { ClientState } from "../types";
import { ClientAction } from "./actions";

export const defaultState: ClientState = {
    client: null,
    clientOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (state: ClientState = defaultState, action: ClientAction): ClientState => {
    switch (action.type) {
        case "CLIENTS_CLIENT_RECEIVE": {
            return {
                ...state,
                client: action.payload,
                clientOriginal: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "CLIENTS_CLIENT_MODIFIED": {
            return {
                ...state,
                client: action.payload,
            };
        }
        case "CLIENTS_CLIENT_FETCHING": {
            return {
                ...state,
                fetching: true,
                client: null,
                clientOriginal: null,
                validationResults: [],
            };
        }
        case "CLIENTS_CLIENT_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "CLIENTS_CLIENT_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "CLIENTS_CLIENT_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CLIENTS_CLIENT_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CLIENTS_CLIENT_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "CLIENTS_CLIENT_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
