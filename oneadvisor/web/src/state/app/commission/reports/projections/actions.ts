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

export type CommissionProjectionsDataAction =
    | CommissionProjectionsDataReceiveAction
    | CommissionProjectionsDataFetchingAction
    | CommissionProjectionsDataFetchingErrorAction
    | CommissionProjectionsDataFiltersReceiveAction
    | CommissionProjectionsDataGroupsReceiveAction;

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