import dayjs from "dayjs";
import { ThunkAction } from "redux-thunk";

import {
    appendFiltersQuery,
    appendPageOptionQuery,
    appendSortOptionQuery,
    applyLike,
} from "@/app/query";
import { Filters, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { SERVER_DATE_FORMAT } from "@/app/utils";
import { commissionsApi } from "@/config/api/commission";
import { RootState } from "@/state";

import { commissionsSelector } from "../";
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

export const fetchCommissions = (
    commissionStatementId?: string
): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        const selector = commissionsSelector(getState());

        let { filters } = selector;
        const { pageOptions, sortOptions } = selector;

        filters = updateFilters(filters);
        filters = mapFilters(filters);

        if (commissionStatementId && filters)
            filters.commissionStatementId = [commissionStatementId];

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

const mapFilters = (filters: Filters | null): Filters | null => {
    if (!filters) return filters;

    if (filters.commissionStatementDate && filters.commissionStatementDate.length == 2) {
        const endDate = dayjs(filters.commissionStatementDate[1])
            .endOf("month")
            .format(SERVER_DATE_FORMAT);

        const dateFilters = {
            startDate: [dayjs(filters.commissionStatementDate[0]).format(SERVER_DATE_FORMAT)],
            endDate: [endDate],
        };

        const mappedFilters = {
            ...filters,
        };

        delete mappedFilters.commissionStatementDate;

        return {
            ...mappedFilters,
            ...dateFilters,
        };
    }

    return filters;
};

export const receivePageOptions = (
    pageOptions: PageOptions
): CommissionListPageOptionsReceiveAction => ({
    type: "COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): CommissionListSortOptionsReceiveAction => ({
    type: "COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (filters: Filters): CommissionListFiltersReceiveAction => ({
    type: "COMMISSIONS_LIST_FILTERS_RECEIVE",
    payload: filters,
});
