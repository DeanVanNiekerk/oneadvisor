import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { commissionReportsApi } from '@/config/api/commission';

import { UserMonthlyCommissionData } from './types';

type UserMonthlyCommissionDataReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_RECEIVE";
    payload: PagedItems<UserMonthlyCommissionData>;
};
type UserMonthlyCommissionDataFetchingAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING";
};
type UserMonthlyCommissionDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING_ERROR";
};
type UserMonthlyCommissionDataPageOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type UserMonthlyCommissionDataSortOptionsReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type UserMonthlyCommissionDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FILTERS_RECEIVE";
    payload: Filters;
};

export type UserMonthlyCommissionDataAction =
    | UserMonthlyCommissionDataReceiveAction
    | UserMonthlyCommissionDataFetchingAction
    | UserMonthlyCommissionDataFetchingErrorAction
    | UserMonthlyCommissionDataPageOptionsReceiveAction
    | UserMonthlyCommissionDataSortOptionsReceiveAction
    | UserMonthlyCommissionDataFiltersReceiveAction;

export const fetchUserMonthlyCommissionData = (filters: Filters): ApiAction => {
    let api = `${commissionReportsApi}/userMonthlyCommissionData`;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION",
    };
};

export const receiveUserMonthlyCommissionFilters = (
    filters: Filters
): UserMonthlyCommissionDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FILTERS_RECEIVE",
    payload: filters,
});
