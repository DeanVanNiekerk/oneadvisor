import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { appendFiltersQuery } from "@/app/query";
import { ApiAction } from "@/app/types";
import { commissionReportsApi } from "@/config/api/commission";
import { RootState } from "@/state/rootReducer";

import { userCompanyMonthlyCommissionSelector } from "../";
import { UserCompanyMonthlyCommissionData, UserCompanyMonthlyCommissionFilters } from "./types";

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

export const fetchUserCompanyMonthlyCommissionData = (): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        let { filters } = userCompanyMonthlyCommissionSelector(getState());

        let api = `${commissionReportsApi}/userCompanyMonthlyCommissionData`;
        api = appendFiltersQuery(api, filters);

        dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION",
        });
    };
};

export const receiveUserCompanyMonthlyCommissionFilters = (
    filters: UserCompanyMonthlyCommissionFilters
): UserCompanyMonthlyCommissionDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE",
    payload: filters,
});

export const receiveUserCompanyMonthlyCommissionUserFilter = (
    userIds: string[]
): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        let { filters } = userCompanyMonthlyCommissionSelector(getState());

        filters = {
            ...filters,
            userId: userIds,
        };

        dispatch(receiveUserCompanyMonthlyCommissionFilters(filters));
    };
};

export const receiveUserCompanyMonthlyCommissionCompanyFilter = (
    companyIds: string[]
): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        let { filters } = userCompanyMonthlyCommissionSelector(getState());

        filters = {
            ...filters,
            companyId: companyIds,
        };

        dispatch(receiveUserCompanyMonthlyCommissionFilters(filters));
    };
};

export const receiveUserCompanyMonthlyCommissionDateRangeFilter = (
    startDate: string,
    endDate: string
): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        let { filters } = userCompanyMonthlyCommissionSelector(getState());

        filters = {
            ...filters,
            startDate: [startDate],
            endDate: [endDate],
        };

        dispatch(receiveUserCompanyMonthlyCommissionFilters(filters));
    };
};
