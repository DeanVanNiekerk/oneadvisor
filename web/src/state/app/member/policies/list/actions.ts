import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { policiesApi } from '@/config/api/member';

import { Policy } from '../types';

type PolicyListReceiveAction = {
    type: 'POLICIES_LIST_RECEIVE';
    payload: PagedItems<Policy>;
};
type PolicyListFetchingAction = { type: 'POLICIES_LIST_FETCHING' };
type PolicyListFetchingErrorAction = { type: 'POLICIES_LIST_FETCHING_ERROR' };
type PolicyListPageOptionsReceiveAction = {
    type: 'POLICIES_LIST_PAGE_OPTIONS_RECEIVE';
    payload: PageOptions;
};
type PolicyListSortOptionsReceiveAction = {
    type: 'POLICIES_LIST_SORT_OPTIONS_RECEIVE';
    payload: SortOptions;
};
type PolicyListFiltersReceiveAction = {
    type: 'POLICIES_LIST_FILTERS_RECEIVE';
    payload: Filters;
};

export type PolicyListAction =
    | PolicyListReceiveAction
    | PolicyListFetchingAction
    | PolicyListFetchingErrorAction
    | PolicyListPageOptionsReceiveAction
    | PolicyListSortOptionsReceiveAction
    | PolicyListFiltersReceiveAction;

export const fetchPolicies = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = policiesApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'POLICIES_LIST'
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): PolicyListPageOptionsReceiveAction => ({
    type: 'POLICIES_LIST_PAGE_OPTIONS_RECEIVE',
    payload: pageOptions
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): PolicyListSortOptionsReceiveAction => ({
    type: 'POLICIES_LIST_SORT_OPTIONS_RECEIVE',
    payload: sortOptions
});

export const receiveFilters = (
    filters: Filters
): PolicyListFiltersReceiveAction => ({
    type: 'POLICIES_LIST_FILTERS_RECEIVE',
    payload: filters
});

export const getPolicies = (
    filters: Filters,
    onSuccess: (policies: Policy[]) => void
): ApiAction => {
    let api = policiesApi;
    api = appendFiltersQuery(api, filters);
    return {
        type: 'API',
        endpoint: api,
        onSuccess: (data: PagedItems<Policy>) => {
            onSuccess(data.items);
        }
    };
};
