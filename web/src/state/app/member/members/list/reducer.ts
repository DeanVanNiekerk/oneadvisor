import { Filters, PageOptions, SortOptions } from '@/app/table';
import { defaultPageOptions, defaultSortOptions } from '@/app/table/defaults';

import { Member } from '../types';
import { MemberListAction } from './actions';

export type State = {
    readonly items: Member[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly error: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    fetching: false,
    error: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions('lastName', 'desc'),
    filters: null
};

export const reducer = (
    state: State = defaultState,
    action: MemberListAction
): State => {
    switch (action.type) {
        case 'MEMBERS_LIST_RECEIVE': {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
                error: false
            };
        }
        case 'MEMBERS_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'MEMBERS_LIST_FETCHING_ERROR': {
            return {
                ...state,
                items: [],
                fetching: false,
                error: true
            };
        }
        case 'MEMBERS_LIST_PAGE_OPTIONS_RECEIVE': {
            return {
                ...state,
                pageOptions: {
                    ...action.payload
                }
            };
        }
        case 'MEMBERS_LIST_SORT_OPTIONS_RECEIVE': {
            return {
                ...state,
                sortOptions: {
                    ...action.payload
                }
            };
        }
        case 'MEMBERS_LIST_FILTERS_RECEIVE': {
            return {
                ...state,
                filters: {
                    ...action.payload
                }
            };
        }
        default:
            return state;
    }
};
