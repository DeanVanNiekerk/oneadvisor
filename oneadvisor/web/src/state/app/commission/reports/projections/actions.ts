import { appendFiltersQuery } from "@/app/query";
import { ApiAction } from "@/app/types";
import { commissionReportsApi } from "@/config/api/commission";

import { Group, PastRevenueCommissionData, PastRevenueCommissionDataFilters } from "./types";

type CommissionProjectionsDataReceiveAction = {
    type: "COMMISSIONS_REPORT_PROJECTIONS_RECEIVE";
    payload: PastRevenueCommissionData[];
};
type CommissionProjectionsDataFetchingAction = {
    type: "COMMISSIONS_REPORT_PROJECTIONS_FETCHING";
};
type CommissionProjectionsDataFetchingErrorAction = {
    type: "COMMISSIONS_REPORT_PROJECTIONS_FETCHING_ERROR";
};
type CommissionProjectionsDataFiltersReceiveAction = {
    type: "COMMISSIONS_REPORT_PROJECTIONS_FILTERS_RECEIVE";
    payload: PastRevenueCommissionDataFilters;
};
type CommissionProjectionsDataGroupsReceiveAction = {
    type: "COMMISSIONS_REPORT_PROJECTIONS_GROUPS_RECEIVE";
    payload: Group[];
};
type CommissionProjectionsDataMonthsBackReceiveAction = {
    type: "COMMISSIONS_REPORT_PROJECTIONS_MONTHS_BACK_RECEIVE";
    payload: number;
};
type CommissionProjectionsDataMonthsForwardReceiveAction = {
    type: "COMMISSIONS_REPORT_PROJECTIONS_MONTHS_FORWARD_RECEIVE";
    payload: number;
};

export type CommissionProjectionsDataAction =
    | CommissionProjectionsDataReceiveAction
    | CommissionProjectionsDataFetchingAction
    | CommissionProjectionsDataFetchingErrorAction
    | CommissionProjectionsDataFiltersReceiveAction
    | CommissionProjectionsDataGroupsReceiveAction
    | CommissionProjectionsDataMonthsBackReceiveAction
    | CommissionProjectionsDataMonthsForwardReceiveAction;

export const fetchPastRevenueCommissionData = (filters: PastRevenueCommissionDataFilters): ApiAction => {
    let api = `${commissionReportsApi}/pastRevenueCommissionData`;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_REPORT_PROJECTIONS",
    };
};

export const receivePastRevenueCommissionFilters = (
    filters: PastRevenueCommissionDataFilters
): CommissionProjectionsDataFiltersReceiveAction => ({
    type: "COMMISSIONS_REPORT_PROJECTIONS_FILTERS_RECEIVE",
    payload: filters,
});

export const receivePastRevenueCommissionGroups = (groups: Group[]): CommissionProjectionsDataGroupsReceiveAction => ({
    type: "COMMISSIONS_REPORT_PROJECTIONS_GROUPS_RECEIVE",
    payload: groups,
});

export const receivePastRevenueCommissionMonthsBack = (
    count: number
): CommissionProjectionsDataMonthsBackReceiveAction => ({
    type: "COMMISSIONS_REPORT_PROJECTIONS_MONTHS_BACK_RECEIVE",
    payload: count,
});

export const receivePastRevenueCommissionMonthsForward = (
    count: number
): CommissionProjectionsDataMonthsForwardReceiveAction => ({
    type: "COMMISSIONS_REPORT_PROJECTIONS_MONTHS_FORWARD_RECEIVE",
    payload: count,
});
