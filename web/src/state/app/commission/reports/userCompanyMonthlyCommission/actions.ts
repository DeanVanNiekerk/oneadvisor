import { appendFiltersQuery } from '@/app/query';
import { Filters, PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { commissionReportsApi } from '@/config/api/commission';

import { UserCompanyMonthlyCommissionData } from './types';

type UserCompanyMonthlyCommissionDataReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_RECEIVE";
    payload: PagedItems<UserCompanyMonthlyCommissionData>;
};
type UserCompanyMonthlyCommissionDataFetchingAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FETCHING";
};
type UserCompanyMonthlyCommissionDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FETCHING_ERROR";
};
type UserCompanyMonthlyCommissionDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE";
    payload: Filters;
};

export type UserCompanyMonthlyCommissionDataAction =
    | UserCompanyMonthlyCommissionDataReceiveAction
    | UserCompanyMonthlyCommissionDataFetchingAction
    | UserCompanyMonthlyCommissionDataFetchingErrorAction
    | UserCompanyMonthlyCommissionDataFiltersReceiveAction;

export const fetchUserCompanyMonthlyCommissionData = (
    filters: Filters
): ApiAction => {
    let api = `${commissionReportsApi}/userCompanyMonthlyCommissionData`;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION",
    };
};

export const receiveUserCompanyMonthlyCommissionFilters = (
    filters: Filters
): UserCompanyMonthlyCommissionDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE",
    payload: filters,
});
