import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { getMonthDateRange } from "@/app/utils";
import { statementsApi } from "@/config/api/commission";
import { RootState } from "@/state";

import { statementsSelector } from "../";
import { PagedStatements } from "../types";

type StatementListReceiveAction = {
    type: "STATEMENTS_LIST_RECEIVE";
    payload: PagedStatements;
};
type StatementListFetchingAction = { type: "STATEMENTS_LIST_FETCHING" };
type StatementListFetchingErrorAction = {
    type: "STATEMENTS_LIST_FETCHING_ERROR";
};
type StatementListPageOptionsReceiveAction = {
    type: "STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type StatementListSortOptionsReceiveAction = {
    type: "STATEMENTS_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type StatementListFiltersReceiveAction = {
    type: "STATEMENTS_LIST_FILTERS_RECEIVE";
    payload: Filters;
};
type StatementListFiltersMonthReceiveAction = {
    type: "STATEMENTS_LIST_FILTERS_MONTH_RECEIVE";
    payload: number;
};
type StatementListFiltersYearReceiveAction = {
    type: "STATEMENTS_LIST_FILTERS_YEAR_RECEIVE";
    payload: number;
};

export type StatementListAction =
    | StatementListReceiveAction
    | StatementListFetchingAction
    | StatementListFetchingErrorAction
    | StatementListPageOptionsReceiveAction
    | StatementListSortOptionsReceiveAction
    | StatementListFiltersReceiveAction
    | StatementListFiltersMonthReceiveAction
    | StatementListFiltersYearReceiveAction;

export const fetchStatements = (): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        const selector = statementsSelector(getState());

        let { filters, sortOptions } = selector;
        const { pageOptions, filterMonth, filterYear } = selector;

        const dateRange = getMonthDateRange(filterMonth, filterYear);
        filters = {
            ...filters,
            startDate: [dateRange.start],
            endDate: [dateRange.end],
        };

        sortOptions = mapSortOptions(sortOptions);

        let api = statementsApi;

        api = appendPageOptionQuery(api, pageOptions);
        api = appendSortOptionQuery(api, sortOptions);
        api = appendFiltersQuery(api, filters);

        dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "STATEMENTS_LIST",
        });
    };
};

const mapSortOptions = (sortOptions: SortOptions): SortOptions => {
    if (sortOptions.column === "companyId") {
        return {
            ...sortOptions,
            column: "companyName",
        };
    }
    return sortOptions;
};

export const updateMonthFilterNext = (): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        const statementsState = statementsSelector(getState());

        let month = statementsState.filterMonth + 1;
        if (month > 12) {
            month = 1;
            dispatch(receiveFilterYear(statementsState.filterYear + 1));
        }
        dispatch(receiveFilterMonth(month));

        //Move to first page if not on first page
        if (statementsState.pageOptions.number !== 1) {
            dispatch(
                receivePageOptions({
                    ...statementsState.pageOptions,
                    number: 1,
                })
            );
        }
    };
};

export const updateMonthFilterPrevious = (): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        const statementsState = statementsSelector(getState());

        let month = statementsState.filterMonth - 1;
        if (month < 1) {
            month = 12;
            dispatch(receiveFilterYear(statementsState.filterYear - 1));
        }
        dispatch(receiveFilterMonth(month));

        //Move to first page if not on first page
        if (statementsState.pageOptions.number !== 1) {
            dispatch(
                receivePageOptions({
                    ...statementsState.pageOptions,
                    number: 1,
                })
            );
        }
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): StatementListPageOptionsReceiveAction => ({
    type: "STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): StatementListSortOptionsReceiveAction => ({
    type: "STATEMENTS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (filters: Filters): StatementListFiltersReceiveAction => ({
    type: "STATEMENTS_LIST_FILTERS_RECEIVE",
    payload: filters,
});

export const receiveFilterMonth = (month: number): StatementListFiltersMonthReceiveAction => ({
    type: "STATEMENTS_LIST_FILTERS_MONTH_RECEIVE",
    payload: month,
});

export const receiveFilterYear = (year: number): StatementListFiltersYearReceiveAction => ({
    type: "STATEMENTS_LIST_FILTERS_YEAR_RECEIVE",
    payload: year,
});
