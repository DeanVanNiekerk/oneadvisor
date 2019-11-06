import { FileInfo } from "@/state/types";

import { StatementFilesListAction } from "./actions";

export type State = {
    readonly items: FileInfo[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: StatementFilesListAction): State => {
    switch (action.type) {
        case "STATEMENTS_FILES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "STATEMENTS_FILES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "STATEMENTS_FILES_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        default:
            return state;
    }
};
