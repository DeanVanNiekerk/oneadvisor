import { Statement } from '../types';
import { StatementPreviewAction } from './actions';

export type State = {
    readonly statement: Statement | null;
    readonly fetching: boolean;
};

export const defaultState: State = {
    statement: null,
    fetching: false,
};

export const reducer = (
    state: State = defaultState,
    action: StatementPreviewAction
): State => {
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
