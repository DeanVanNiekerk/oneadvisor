import { PreviewState } from "../types";
import { ClientPreviewAction } from "./actions";

export const defaultState: PreviewState = {
    client: null,
    fetching: false,
};

export const reducer = (
    state: PreviewState = defaultState,
    action: ClientPreviewAction
): PreviewState => {
    switch (action.type) {
        case "CLIENTS_CLIENT_PREVIEW_RECEIVE": {
            return {
                ...state,
                client: action.payload,
                fetching: false,
            };
        }
        case "CLIENTS_CLIENT_PREVIEW_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "CLIENTS_CLIENT_PREVIEW_FETCHING_ERROR": {
            return {
                ...state,
                client: null,
                fetching: false,
            };
        }
        default:
            return state;
    }
};
