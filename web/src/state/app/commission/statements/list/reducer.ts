import moment from 'moment';

import { Filters, PageOptions, SortOptions } from '@/app/table';
import { defaultPageOptions, defaultSortOptions } from '@/app/table/defaults';

import { Statement } from '../types';
import { StatementListAction } from './actions';

export type State = {
    readonly items: Statement[];
    readonly totalItems: number;
    readonly sumAmountIncludingVAT: number;
    readonly sumVAT: number;
    readonly averageAmountIncludingVAT: number;
    readonly averageVAT: number;
    readonly fetching: boolean;
    readonly error: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filterMonth: number;
    readonly filterYear: number;
    readonly filters: Filters | null;
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    sumAmountIncludingVAT: 0,
    sumVAT: 0,
    averageAmountIncludingVAT: 0,
    averageVAT: 0,
    fetching: false,
    error: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions('', 'desc'),
    filterMonth: moment().month(),
    filterYear: moment().year(),
    filters: null
};

export const reducer = (
    state: State = defaultState,
    action: StatementListAction
): State => {
    switch (action.type) {
        case 'STATEMENTS_LIST_RECEIVE': {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                sumAmountIncludingVAT: action.payload.sumAmountIncludingVAT,
                sumVAT: action.payload.sumVAT,
                averageAmountIncludingVAT:
                    action.payload.averageAmountIncludingVAT,
                averageVAT: action.payload.averageVAT,
                items: action.payload.items,
                fetching: false,
                error: false
            };
        }
        case 'STATEMENTS_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'STATEMENTS_LIST_FETCHING_ERROR': {
            return {
                ...state,
                items: [],
                fetching: false,
                error: true
            };
        }
        case 'STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE': {
            return {
                ...state,
                pageOptions: {
                    ...action.payload
                }
            };
        }
        case 'STATEMENTS_LIST_SORT_OPTIONS_RECEIVE': {
            return {
                ...state,
                sortOptions: {
                    ...action.payload
                }
            };
        }
        case 'STATEMENTS_LIST_FILTERS_RECEIVE': {
            return {
                ...state,
                filters: {
                    ...action.payload
                }
            };
        }
        case 'STATEMENTS_LIST_FILTERS_MONTH_RECEIVE': {
            return {
                ...state,
                filterMonth: action.payload
            };
        }
        case 'STATEMENTS_LIST_FILTERS_YEAR_RECEIVE': {
            return {
                ...state,
                filterYear: action.payload
            };
        }
        default:
            return state;
    }
};
