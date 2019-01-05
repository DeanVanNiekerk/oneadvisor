import { Company } from '../types';
import { CompanyListAction } from './actions';

export type State = {
    readonly items: Company[];
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: CompanyListAction
): State => {
    switch (action.type) {
        case 'COMPANIES_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'COMPANIES_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'COMPANIES_LIST_FETCHING_ERROR': {
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
