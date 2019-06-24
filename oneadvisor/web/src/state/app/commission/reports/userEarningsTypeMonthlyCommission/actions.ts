import { appendFiltersQuery } from '@/app/query';
import { Filters } from '@/app/table';
import { ApiAction } from '@/app/types';
import { commissionReportsApi } from '@/config/api/commission';

import { UserEarningsTypeMonthlyCommissionData } from './types';

type UserEarningsTypeMonthlyCommissionDataReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_RECEIVE";
    payload: UserEarningsTypeMonthlyCommissionData[];
};
type UserEarningsTypeMonthlyCommissionDataFetchingAction = {
    type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING";
};
type UserEarningsTypeMonthlyCommissionDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING_ERROR";
};
type UserEarningsTypeMonthlyCommissionDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE";
    payload: Filters;
};

export type UserEarningsTypeMonthlyCommissionDataAction =
    | UserEarningsTypeMonthlyCommissionDataReceiveAction
    | UserEarningsTypeMonthlyCommissionDataFetchingAction
    | UserEarningsTypeMonthlyCommissionDataFetchingErrorAction
    | UserEarningsTypeMonthlyCommissionDataFiltersReceiveAction;

export const fetchUserEarningsTypeMonthlyCommissionData = (
    filters: Filters
): ApiAction => {
    let api = `${commissionReportsApi}/userEarningsTypeMonthlyCommissionData`;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix:
            "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION",
    };
};

export const receiveUserEarningsTypeMonthlyCommissionFilters = (
    filters: Filters
): UserEarningsTypeMonthlyCommissionDataFiltersReceiveAction => ({
    type:
        "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE",
    payload: filters,
});
