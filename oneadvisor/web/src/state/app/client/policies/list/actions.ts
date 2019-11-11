import { ThunkAction } from "redux-thunk";

import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery, applyLike } from "@/app/query";
import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { policiesApi } from "@/config/api/client";
import { RootState } from "@/state/rootReducer";

import { policiesSelector } from "../";
import { Policy } from "../types";

type PolicyListReceiveAction = {
    type: "POLICIES_LIST_RECEIVE";
    payload: PagedItems<Policy>;
};
type PolicyListFetchingAction = { type: "POLICIES_LIST_FETCHING" };
type PolicyListFetchingErrorAction = { type: "POLICIES_LIST_FETCHING_ERROR" };
type PolicyListPageOptionsReceiveAction = {
    type: "POLICIES_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type PolicyListSortOptionsReceiveAction = {
    type: "POLICIES_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type PolicyListFiltersReceiveAction = {
    type: "POLICIES_LIST_FILTERS_RECEIVE";
    payload: Filters;
};

export type PolicyListAction =
    | PolicyListReceiveAction
    | PolicyListFetchingAction
    | PolicyListFetchingErrorAction
    | PolicyListPageOptionsReceiveAction
    | PolicyListSortOptionsReceiveAction
    | PolicyListFiltersReceiveAction;

export const fetchPolicies = (clientId?: string): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        const selector = policiesSelector(getState());

        const { pageOptions } = selector;
        let { filters, sortOptions } = selector;

        sortOptions = mapSortOptions(sortOptions);

        filters = updateFilters(filters);

        if (clientId) filters.clientId = [clientId];

        let api = policiesApi;
        api = appendPageOptionQuery(api, pageOptions);
        api = appendSortOptionQuery(api, sortOptions);
        api = appendFiltersQuery(api, filters);

        dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "POLICIES_LIST",
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

const updateFilters = (filters: Filters | null): Filters => {
    return applyLike(filters, ["number", "clientLastName"]);
};

export const receivePageOptions = (pageOptions: PageOptions): PolicyListPageOptionsReceiveAction => ({
    type: "POLICIES_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (sortOptions: SortOptions): PolicyListSortOptionsReceiveAction => ({
    type: "POLICIES_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (filters: Filters): PolicyListFiltersReceiveAction => ({
    type: "POLICIES_LIST_FILTERS_RECEIVE",
    payload: filters,
});

export const getPolicies = (
    filters: Filters,
    pageOptions: PageOptions,
    onSuccess: (policies: Policy[]) => void
): ApiAction => {
    let api = policiesApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        onSuccess: (data: PagedItems<Policy>) => {
            onSuccess(data.items);
        },
    };
};
