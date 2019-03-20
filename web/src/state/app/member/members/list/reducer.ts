import { Filters, PageOptions, SortOptions } from '@/app/table';
import { defaultPageOptions, defaultSortOptions } from '@/app/table/defaults';

import { Member } from '../types';
import { MemberListAction } from './actions';

export type State = {
    readonly items: Member[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
    readonly selectedMemberIds: string[];
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("", "desc"),
    filters: null,
    selectedMemberIds: [],
};

export const reducer = (
    state: State = defaultState,
    action: MemberListAction
): State => {
    switch (action.type) {
        case "MEMBERS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "MEMBERS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "MEMBERS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "MEMBERS_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "MEMBERS_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        case "MEMBERS_LIST_FILTERS_RECEIVE": {
            return {
                ...state,
                filters: {
                    ...action.payload,
                },
            };
        }
        case "MEMBERS_LIST_SELECTED_RECEIVE": {
            return {
                ...state,
                selectedMemberIds: action.payload,
            };
        }
        default:
            return state;
    }
};
