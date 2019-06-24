import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { statementsApi } from '@/config/api/commission';

import { PagedStatements } from '../types';

type StatementListReceiveAction = {
    type: 'STATEMENTS_LIST_RECEIVE';
    payload: PagedStatements;
};
type StatementListFetchingAction = { type: 'STATEMENTS_LIST_FETCHING' };
type StatementListFetchingErrorAction = {
    type: 'STATEMENTS_LIST_FETCHING_ERROR';
};
type StatementListPageOptionsReceiveAction = {
    type: 'STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE';
    payload: PageOptions;
};
type StatementListSortOptionsReceiveAction = {
    type: 'STATEMENTS_LIST_SORT_OPTIONS_RECEIVE';
    payload: SortOptions;
};
type StatementListFiltersReceiveAction = {
    type: 'STATEMENTS_LIST_FILTERS_RECEIVE';
    payload: Filters;
};
type StatementListFiltersMonthReceiveAction = {
    type: 'STATEMENTS_LIST_FILTERS_MONTH_RECEIVE';
    payload: number;
};
type StatementListFiltersYearReceiveAction = {
    type: 'STATEMENTS_LIST_FILTERS_YEAR_RECEIVE';
    payload: number;
};

export type StatementListAction =
    | StatementListReceiveAction
    | StatementListFetchingAction
    | StatementListFetchingErrorAction
    | StatementListPageOptionsReceiveAction
    | StatementListSortOptionsReceiveAction
    | StatementListFiltersReceiveAction
    | StatementListFiltersMonthReceiveAction
    | StatementListFiltersYearReceiveAction;

export const fetchStatements = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = statementsApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'STATEMENTS_LIST'
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): StatementListPageOptionsReceiveAction => ({
    type: 'STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE',
    payload: pageOptions
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): StatementListSortOptionsReceiveAction => ({
    type: 'STATEMENTS_LIST_SORT_OPTIONS_RECEIVE',
    payload: sortOptions
});

export const receiveFilters = (
    filters: Filters
): StatementListFiltersReceiveAction => ({
    type: 'STATEMENTS_LIST_FILTERS_RECEIVE',
    payload: filters
});

export const receiveFilterMonth = (
    month: number
): StatementListFiltersMonthReceiveAction => ({
    type: 'STATEMENTS_LIST_FILTERS_MONTH_RECEIVE',
    payload: month
});

export const receiveFilterYear = (
    year: number
): StatementListFiltersYearReceiveAction => ({
    type: 'STATEMENTS_LIST_FILTERS_YEAR_RECEIVE',
    payload: year
});
