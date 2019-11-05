import moment from "moment";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { appendFiltersQuery } from "@/app/query";
import { ApiAction } from "@/app/types";
import { commissionReportsApi } from "@/config/api/commission";
import { RootState } from "@/state/rootReducer";

import { userEarningsTypeMonthlyCommissionSelector } from "../";
import { UserEarningsTypeMonthlyCommissionData, UserEarningsTypeMonthlyCommissionFilters } from "./types";

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
    payload: UserEarningsTypeMonthlyCommissionFilters;
};

export type UserEarningsTypeMonthlyCommissionDataAction =
    | UserEarningsTypeMonthlyCommissionDataReceiveAction
    | UserEarningsTypeMonthlyCommissionDataFetchingAction
    | UserEarningsTypeMonthlyCommissionDataFetchingErrorAction
    | UserEarningsTypeMonthlyCommissionDataFiltersReceiveAction;

export const fetchUserEarningsTypeMonthlyCommissionData = (): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        let { filters } = userEarningsTypeMonthlyCommissionSelector(getState());

        let api = `${commissionReportsApi}/userEarningsTypeMonthlyCommissionData`;
        api = appendFiltersQuery(api, filters);

        dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION",
        });
    };
};

export const receiveUserEarningsTypeMonthlyCommissionFilters = (
    filters: UserEarningsTypeMonthlyCommissionFilters
): UserEarningsTypeMonthlyCommissionDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE",
    payload: filters,
});

export const receiveUserEarningsTypeMonthlyCommissionUserFilter = (
    userIds: string[]
): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        let { filters } = userEarningsTypeMonthlyCommissionSelector(getState());

        filters = {
            ...filters,
            userId: userIds,
        };

        dispatch(receiveUserEarningsTypeMonthlyCommissionFilters(filters));
    };
};

export const receiveUserEarningsTypeMonthlyCommissionCompanyFilter = (
    companyIds: string[]
): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        let { filters } = userEarningsTypeMonthlyCommissionSelector(getState());

        filters = {
            ...filters,
            companyId: companyIds,
        };

        dispatch(receiveUserEarningsTypeMonthlyCommissionFilters(filters));
    };
};

export const receiveUserEarningsTypeMonthlyCommissionDateRangeFilter = (
    startDate: string,
    endDate: string
): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        let { filters } = userEarningsTypeMonthlyCommissionSelector(getState());

        filters = {
            ...filters,
            startDate: [startDate],
            endDate: [endDate],
        };

        dispatch(receiveUserEarningsTypeMonthlyCommissionFilters(filters));
    };
};
