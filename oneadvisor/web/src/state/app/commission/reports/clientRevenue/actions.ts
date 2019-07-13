import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery, applyLike } from "@/app/query";
import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { commissionReportsApi } from "@/config/api/commission";

import { ClientRevenueData, ClientRevenueDataFilters } from "./types";

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

type ClientRevenueDataPagedReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGED_RECEIVE";
    payload: PagedItems<ClientRevenueData>;
};
type ClientRevenueDataPagedFetchingAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGED_FETCHING";
};
type ClientRevenueDataPagedFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGED_FETCHING_ERROR";
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
    payload: ClientRevenueDataFilters;
};

export type ClientRevenueDataAction =
    | ClientRevenueDataPagedReceiveAction
    | ClientRevenueDataReceiveAction
    | ClientRevenueDataFetchingAction
    | ClientRevenueDataFetchingErrorAction
    | ClientRevenueDataPageOptionsReceiveAction
    | ClientRevenueDataSortOptionsReceiveAction
    | ClientRevenueDataFiltersReceiveAction
    | ClientRevenueDataPagedFetchingAction
    | ClientRevenueDataPagedFetchingErrorAction;

export const fetchClientRevenueData = (filters: ClientRevenueDataFilters): ApiAction => {
    let api = `${commissionReportsApi}/clientRevenueData`;
    api = appendFiltersQuery(api, updateFilters(filters));
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_MEM_REVENUE",
    };
};

export const fetchClientRevenueDataPaged = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: ClientRevenueDataFilters
): ApiAction => {
    let api = `${commissionReportsApi}/clientRevenueData`;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, updateFilters(filters));
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_MEM_REVENUE_PAGED",
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
    filters: ClientRevenueDataFilters
): ClientRevenueDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE",
    payload: filters,
});

export const getClientRevenueData = (
    filters: ClientRevenueDataFilters,
    onSuccess: (records: PagedItems<ClientRevenueData>) => void
): ApiAction => {
    let api = `${commissionReportsApi}/clientRevenueData`;
    api = appendFiltersQuery(api, updateFilters(filters));
    return {
        type: "API",
        endpoint: api,
        onSuccess: onSuccess,
    };
};

const updateFilters = (filters: Filters): Filters => {
    return applyLike(filters, ["clientLastName"]);
};
