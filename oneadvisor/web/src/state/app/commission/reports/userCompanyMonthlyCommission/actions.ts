import { appendFiltersQuery } from '@/app/query';
import { ApiAction } from '@/app/types';
import { commissionReportsApi } from '@/config/api/commission';

import { UserCompanyMonthlyCommissionData, UserCompanyMonthlyCommissionFilters } from './types';

type UserCompanyMonthlyCommissionDataReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_RECEIVE";
    payload: UserCompanyMonthlyCommissionData[];
};
type UserCompanyMonthlyCommissionDataFetchingAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FETCHING";
};
type UserCompanyMonthlyCommissionDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FETCHING_ERROR";
};
type UserCompanyMonthlyCommissionDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE";
    payload: UserCompanyMonthlyCommissionFilters;
};

export type UserCompanyMonthlyCommissionDataAction =
    | UserCompanyMonthlyCommissionDataReceiveAction
    | UserCompanyMonthlyCommissionDataFetchingAction
    | UserCompanyMonthlyCommissionDataFetchingErrorAction
    | UserCompanyMonthlyCommissionDataFiltersReceiveAction;

export const fetchUserCompanyMonthlyCommissionData = (filters: UserCompanyMonthlyCommissionFilters): ApiAction => {
    let api = `${commissionReportsApi}/userCompanyMonthlyCommissionData`;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION",
    };
};

export const receiveUserCompanyMonthlyCommissionFilters = (
    filters: UserCompanyMonthlyCommissionFilters
): UserCompanyMonthlyCommissionDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE",
    payload: filters,
});
