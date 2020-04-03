import { FilesState } from "../";
import { StatementFilesListAction } from "./actions";

export const defaultState: FilesState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: FilesState = defaultState,
    action: StatementFilesListAction
): FilesState => {
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
