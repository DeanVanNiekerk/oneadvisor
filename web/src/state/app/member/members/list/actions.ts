import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { membersApi } from '@/config/api/member';

import { Member } from '../types';

type MemberListReceiveAction = {
    type: 'MEMBERS_LIST_RECEIVE';
    payload: PagedItems<Member>;
};
type MemberListFetchingAction = { type: 'MEMBERS_LIST_FETCHING' };
type MemberListFetchingErrorAction = { type: 'MEMBERS_LIST_FETCHING_ERROR' };
type MemberListPageOptionsReceiveAction = {
    type: 'MEMBERS_LIST_PAGE_OPTIONS_RECEIVE';
    payload: PageOptions;
};
type MemberListSortOptionsReceiveAction = {
    type: 'MEMBERS_LIST_SORT_OPTIONS_RECEIVE';
    payload: SortOptions;
};
type MemberListFiltersReceiveAction = {
    type: 'MEMBERS_LIST_FILTERS_RECEIVE';
    payload: Filters;
};

export type MemberListAction =
    | MemberListReceiveAction
    | MemberListFetchingAction
    | MemberListFetchingErrorAction
    | MemberListPageOptionsReceiveAction
    | MemberListSortOptionsReceiveAction
    | MemberListFiltersReceiveAction;

export const fetchMembers = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = membersApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'MEMBERS_LIST'
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): MemberListPageOptionsReceiveAction => ({
    type: 'MEMBERS_LIST_PAGE_OPTIONS_RECEIVE',
    payload: pageOptions
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): MemberListSortOptionsReceiveAction => ({
    type: 'MEMBERS_LIST_SORT_OPTIONS_RECEIVE',
    payload: sortOptions
});

export const receiveFilters = (
    filters: Filters
): MemberListFiltersReceiveAction => ({
    type: 'MEMBERS_LIST_FILTERS_RECEIVE',
    payload: filters
});
