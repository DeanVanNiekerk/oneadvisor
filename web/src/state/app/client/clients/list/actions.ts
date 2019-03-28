import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { clientsApi } from '@/config/api/client';

import { Client } from '../types';

type ClientListReceiveAction = {
    type: "CLIENTS_LIST_RECEIVE";
    payload: PagedItems<Client>;
};
type ClientListFetchingAction = { type: "CLIENTS_LIST_FETCHING" };
type ClientListFetchingErrorAction = { type: "CLIENTS_LIST_FETCHING_ERROR" };
type ClientListPageOptionsReceiveAction = {
    type: "CLIENTS_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type ClientListSortOptionsReceiveAction = {
    type: "CLIENTS_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type ClientListFiltersReceiveAction = {
    type: "CLIENTS_LIST_FILTERS_RECEIVE";
    payload: Filters;
};
type ClientListSelectedReceiveAction = {
    type: "CLIENTS_LIST_SELECTED_RECEIVE";
    payload: string[];
};

export type ClientListAction =
    | ClientListReceiveAction
    | ClientListFetchingAction
    | ClientListFetchingErrorAction
    | ClientListPageOptionsReceiveAction
    | ClientListSortOptionsReceiveAction
    | ClientListFiltersReceiveAction
    | ClientListSelectedReceiveAction;

export const fetchClients = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = clientsApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "CLIENTS_LIST",
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): ClientListPageOptionsReceiveAction => ({
    type: "CLIENTS_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): ClientListSortOptionsReceiveAction => ({
    type: "CLIENTS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (
    filters: Filters
): ClientListFiltersReceiveAction => ({
    type: "CLIENTS_LIST_FILTERS_RECEIVE",
    payload: filters,
});

export const receiveSelectedClients = (
    clientIds: string[]
): ClientListSelectedReceiveAction => ({
    type: "CLIENTS_LIST_SELECTED_RECEIVE",
    payload: clientIds,
});