import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { commissionReportsApi } from '@/config/api/commission';

import { MemberRevenueData } from './types';

type MemberRevenueDataReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_RECEIVE";
    payload: PagedItems<MemberRevenueData>;
};
type MemberRevenueDataFetchingAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING";
};
type MemberRevenueDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING_ERROR";
};
type MemberRevenueDataPageOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type MemberRevenueDataSortOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type MemberRevenueDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE";
    payload: Filters;
};

export type MemberRevenueDataAction =
    | MemberRevenueDataReceiveAction
    | MemberRevenueDataFetchingAction
    | MemberRevenueDataFetchingErrorAction
    | MemberRevenueDataPageOptionsReceiveAction
    | MemberRevenueDataSortOptionsReceiveAction
    | MemberRevenueDataFiltersReceiveAction;

export const fetchMemberRevenueData = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = `${commissionReportsApi}/memberRevenueData`;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_MEM_REVENUE",
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): MemberRevenueDataPageOptionsReceiveAction => ({
    type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): MemberRevenueDataSortOptionsReceiveAction => ({
    type: "COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (
    filters: Filters
): MemberRevenueDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE",
    payload: filters,
});
