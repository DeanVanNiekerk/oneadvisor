import { Statement } from '../types';
import { StatementPreviewAction } from './actions';

export type State = {
    readonly statement: Statement | null;
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    statement: null,
    fetching: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: StatementPreviewAction
): State => {
    switch (action.type) {
        case 'STATEMENTS_STATEMENT_PREVIEW_RECEIVE': {
            return {
                ...state,
                statement: action.payload.items[0],
                fetching: false,
                error: false
            };
        }
        case 'STATEMENTS_STATEMENT_PREVIEW_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'STATEMENTS_STATEMENT_PREVIEW_FETCHING_ERROR': {
            return {
                ...state,
                statement: null,
                fetching: false,
                error: true
            };
        }
        case 'STATEMENTS_STATEMENT_PREVIEW_CLEAR': {
            return {
                ...state,
                statement: null
            };
        }
        default:
            return state;
    }
};
