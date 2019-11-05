import { ThunkAction } from "redux-thunk";

import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery, applyLike } from "@/app/query";
import { Filters, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { commissionsApi } from "@/config/api/commission";
import { RootState } from "@/state/rootReducer";

import { commissionSelector, commissionsSelector } from "../";
import { PagedCommissions } from "../types";

type CommissionListReceiveAction = {
    type: "COMMISSIONS_LIST_RECEIVE";
    payload: PagedCommissions;
};
type CommissionListFetchingAction = { type: "COMMISSIONS_LIST_FETCHING" };
type CommissionListFetchingErrorAction = {
    type: "COMMISSIONS_LIST_FETCHING_ERROR";
};
type CommissionListPageOptionsReceiveAction = {
    type: "COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type CommissionListSortOptionsReceiveAction = {
    type: "COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type CommissionListFiltersReceiveAction = {
    type: "COMMISSIONS_LIST_FILTERS_RECEIVE";
    payload: Filters;
};

export type CommissionListAction =
    | CommissionListReceiveAction
    | CommissionListFetchingAction
    | CommissionListFetchingErrorAction
    | CommissionListPageOptionsReceiveAction
    | CommissionListSortOptionsReceiveAction
    | CommissionListFiltersReceiveAction;

export const fetchCommissions = (commissionStatementId?: string): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        let { pageOptions, sortOptions, filters } = commissionsSelector(getState());

        filters = updateFilters(filters);

        if (commissionStatementId && filters) filters.commissionStatementId = [commissionStatementId];

        let api = commissionsApi;
        api = appendPageOptionQuery(api, pageOptions);
        api = appendSortOptionQuery(api, sortOptions);
        api = appendFiltersQuery(api, filters);

        dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_LIST",
        });
    };
};

const updateFilters = (filters: Filters | null): Filters | null => {
    return applyLike(filters, ["policyNumber", "policyClientLastName"]);
};

export const receivePageOptions = (pageOptions: PageOptions): CommissionListPageOptionsReceiveAction => ({
    type: "COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (sortOptions: SortOptions): CommissionListSortOptionsReceiveAction => ({
    type: "COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (filters: Filters): CommissionListFiltersReceiveAction => ({
    type: "COMMISSIONS_LIST_FILTERS_RECEIVE",
    payload: filters,
});
