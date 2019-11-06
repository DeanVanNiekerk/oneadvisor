import { ClientEdit, Client } from "../types";
import { ClientMergeAction } from "./actions";

export type State = {
    readonly clients: Client[];
    readonly fetching: boolean;
    readonly currentStepIndex: number;
    readonly steps: string[];
    readonly insertedClient: ClientEdit | null;
};

export const defaultState: State = {
    clients: [],
    fetching: false,
    currentStepIndex: 0,
    steps: ["Clients", "Review", "Result"],
    insertedClient: null,
};

export const reducer = (state: State = defaultState, action: ClientMergeAction): State => {
    switch (action.type) {
        case "CLIENTS_MERGE_SOURCE_RECEIVE": {
            return {
                ...state,
                clients: action.payload.items,
                fetching: false,
            };
        }
        case "CLIENTS_MERGE_SOURCE_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "CLIENTS_MERGE_SOURCE_FETCHING_ERROR": {
            return {
                ...state,
                clients: [],
                fetching: false,
            };
        }
        case "CLIENTS_MERGE_NEXT_STEP": {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex + 1,
            };
        }
        case "CLIENTS_MERGE_PREVIOUS_STEP": {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex - 1,
            };
        }
        case "CLIENTS_MERGE_RESET": {
            return {
                ...state,
                clients: [],
                currentStepIndex: 0,
                insertedClient: null,
            };
        }
        case "CLIENTS_MERGE_RECEIVE": {
            return {
                ...state,
                insertedClient: action.payload ? action.payload.tag : null,
                fetching: false,
            };
        }
        case "CLIENTS_MERGE_FETCHING": {
            return {
                ...state,
                fetching: true,
                insertedClient: null,
            };
        }
        case "CLIENTS_MERGE_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "CLIENTS_MERGE_VALIDATION_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        default:
            return state;
    }
};
