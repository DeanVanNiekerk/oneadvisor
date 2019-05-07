import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { commissionReportsApi } from '@/config/api/commission';

import { ClientRevenueData } from './types';

type ClientRevenueDataReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_RECEIVE";
    payload: PagedItems<ClientRevenueData>;
};
type ClientRevenueDataFetchingAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING";
};
type ClientRevenueDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING_ERROR";
};
type ClientRevenueDataPageOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type ClientRevenueDataSortOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type ClientRevenueDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE";
    payload: Filters;
};

export type ClientRevenueDataAction =
    | ClientRevenueDataReceiveAction
    | ClientRevenueDataFetchingAction
    | ClientRevenueDataFetchingErrorAction
    | ClientRevenueDataPageOptionsReceiveAction
    | ClientRevenueDataSortOptionsReceiveAction
    | ClientRevenueDataFiltersReceiveAction;

export const fetchClientRevenueData = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = `${commissionReportsApi}/clientRevenueData`;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_MEM_REVENUE",
    };
};

export const receiveClientRevenuePageOptions = (
    pageOptions: PageOptions
): ClientRevenueDataPageOptionsReceiveAction => ({
    type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveClientRevenueSortOptions = (
    sortOptions: SortOptions
): ClientRevenueDataSortOptionsReceiveAction => ({
    type: "COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveClientRevenueFilters = (
    filters: Filters
): ClientRevenueDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE",
    payload: filters,
});

export const getClientRevenueData = (
    filters: Filters,
    onSuccess: (records: PagedItems<ClientRevenueData>) => void
): ApiAction => {
    let api = `${commissionReportsApi}/clientRevenueData`;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        onSuccess: onSuccess,
    };
};
