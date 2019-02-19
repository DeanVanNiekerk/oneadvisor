import { Filters, PageOptions, SortOptions } from '@/app/table';
import { defaultPageOptions, defaultSortOptions } from '@/app/table/defaults';

import { Member } from '../types';
import { MemberSearchAction } from './actions';

export type State = {
    readonly items: Member[];
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
    action: MemberSearchAction
): State => {
    switch (action.type) {
        case 'MEMBERS_SEARCH_RECEIVE': {
            return {
                ...state,
                items: action.payload.items,
                fetching: false,
                error: false
            };
        }
        case 'MEMBERS_SEARCH_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'MEMBERS_SEARCH_FETCHING_ERROR': {
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
