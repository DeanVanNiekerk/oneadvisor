import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { commissionsApi } from '@/config/api/commission';

import { PagedCommissions } from '../types';

type CommissionListReceiveAction = {
    type: 'COMMISSIONS_LIST_RECEIVE';
    payload: PagedCommissions;
};
type CommissionListFetchingAction = { type: 'COMMISSIONS_LIST_FETCHING' };
type CommissionListFetchingErrorAction = {
    type: 'COMMISSIONS_LIST_FETCHING_ERROR';
};
type CommissionListPageOptionsReceiveAction = {
    type: 'COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE';
    payload: PageOptions;
};
type CommissionListSortOptionsReceiveAction = {
    type: 'COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE';
    payload: SortOptions;
};
type CommissionListFiltersReceiveAction = {
    type: 'COMMISSIONS_LIST_FILTERS_RECEIVE';
    payload: Filters;
};

export type CommissionListAction =
    | CommissionListReceiveAction
    | CommissionListFetchingAction
    | CommissionListFetchingErrorAction
    | CommissionListPageOptionsReceiveAction
    | CommissionListSortOptionsReceiveAction
    | CommissionListFiltersReceiveAction;

export const fetchCommissions = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = commissionsApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'COMMISSIONS_LIST'
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): CommissionListPageOptionsReceiveAction => ({
    type: 'COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE',
    payload: pageOptions
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): CommissionListSortOptionsReceiveAction => ({
    type: 'COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE',
    payload: sortOptions
});

export const receiveFilters = (
    filters: Filters
): CommissionListFiltersReceiveAction => ({
    type: 'COMMISSIONS_LIST_FILTERS_RECEIVE',
    payload: filters
});
