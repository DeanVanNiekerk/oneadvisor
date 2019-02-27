import { CommissionStatementTemplate } from '../types';
import { TemplateListAction } from './actions';

export type State = {
    readonly items: CommissionStatementTemplate[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    fetching: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: TemplateListAction
): State => {
    switch (action.type) {
        case 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_RECEIVE': {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
                error: false
            };
        }
        case 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING_ERROR': {
            return {
                ...state,
                items: [],
                fetching: false,
                error: true
            };
        }
        default:
            return state;
    }
};
