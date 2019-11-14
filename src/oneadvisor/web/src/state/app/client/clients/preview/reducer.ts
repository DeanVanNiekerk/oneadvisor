import { ClientPreview } from "../types";
import { ClientPreviewAction } from "./actions";

export type State = {
    readonly client: ClientPreview | null;
    readonly fetching: boolean;
};

export const defaultState: State = {
    client: null,
    fetching: false,
};

export const reducer = (state: State = defaultState, action: ClientPreviewAction): State => {
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
