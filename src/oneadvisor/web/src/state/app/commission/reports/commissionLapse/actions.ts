import {
    appendFiltersQuery,
    appendPageOptionQuery,
    appendSortOptionQuery,
    applyLike,
} from "@/app/query";
import { PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { commissionReportsApi } from "@/config/api/commission";

import { CommissionLapseData, CommissionLapseDataFilters } from "./types";

type CommissionLapseDataReceiveAction = {
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_RECEIVE";
    payload: PagedItems<CommissionLapseData>;
};
type CommissionLapseDataFetchingAction = {
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING";
};
type CommissionLapseDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING_ERROR";
};
type CommissionLapseDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FILTERS_RECEIVE";
    payload: CommissionLapseDataFilters;
};
type CommissionLapseDataPageOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type CommissionLapseDataSortOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};

export type CommissionCommissionLapseDataAction =
    | CommissionLapseDataReceiveAction
    | CommissionLapseDataFetchingAction
    | CommissionLapseDataFetchingErrorAction
    | CommissionLapseDataFiltersReceiveAction
    | CommissionLapseDataPageOptionsReceiveAction
    | CommissionLapseDataSortOptionsReceiveAction;

export const fetchCommissionLapseData = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: CommissionLapseDataFilters
): ApiAction => {
    let api = `${commissionReportsApi}/commissionLapseData`;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, updateFilters(filters));
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_COMMISSIONLAPSE",
    };
};

const updateFilters = (filters: CommissionLapseDataFilters): CommissionLapseDataFilters => {
    return applyLike(filters, ["number", "clientLastName"]);
};

export const receiveCommissionLapseFilters = (
    filters: CommissionLapseDataFilters
): CommissionLapseDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FILTERS_RECEIVE",
    payload: filters,
});

export const receiveCommissionLapsePageOptions = (
    pageOptions: PageOptions
): CommissionLapseDataPageOptionsReceiveAction => ({
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveCommissionLapseSortOptions = (
    sortOptions: SortOptions
): CommissionLapseDataSortOptionsReceiveAction => ({
    type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});
