import { PreviewState } from "../types";
import { StatementPreviewAction } from "./actions";

export const defaultState: PreviewState = {
    statement: null,
    fetching: false,
};

export const reducer = (
    state: PreviewState = defaultState,
    action: StatementPreviewAction
): PreviewState => {
    switch (action.type) {
        case "STATEMENTS_STATEMENT_PREVIEW_RECEIVE": {
            return {
                ...state,
                statement: action.payload.items[0],
                fetching: false,
            };
        }
        case "STATEMENTS_STATEMENT_PREVIEW_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "STATEMENTS_STATEMENT_PREVIEW_FETCHING_ERROR": {
            return {
                ...state,
                statement: null,
                fetching: false,
            };
        }
        case "STATEMENTS_STATEMENT_PREVIEW_CLEAR": {
            return {
                ...state,
                statement: null,
            };
        }
        default:
            return state;
    }
};
