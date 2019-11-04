import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { splitRulePoliciesApi } from "@/config/api/commission";

import { SplitRulePolicyInfo } from "../types";

type SplitRulePolicyListReceiveAction = {
    type: "SPLITRULEPOLICIES_LIST_RECEIVE";
    payload: PagedItems<SplitRulePolicyInfo>;
};
type SplitRulePolicyListFetchingAction = { type: "SPLITRULEPOLICIES_LIST_FETCHING" };
type SplitRulePolicyListFetchingErrorAction = {
    type: "SPLITRULEPOLICIES_LIST_FETCHING_ERROR";
};
type SplitRulePolicyListPageOptionsReceiveAction = {
    type: "SPLITRULEPOLICIES_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type SplitRulePolicyListSortOptionsReceiveAction = {
    type: "SPLITRULEPOLICIES_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type SplitRulePolicyListFiltersReceiveAction = {
    type: "SPLITRULEPOLICIES_LIST_FILTERS_RECEIVE";
    payload: Filters;
};

export type SplitRulePolicyListAction =
    | SplitRulePolicyListReceiveAction
    | SplitRulePolicyListFetchingAction
    | SplitRulePolicyListFetchingErrorAction
    | SplitRulePolicyListPageOptionsReceiveAction
    | SplitRulePolicyListSortOptionsReceiveAction
    | SplitRulePolicyListFiltersReceiveAction;

export const fetchSplitRulePolicies = (
    pageOptions: PageOptions,
    sortOptions: SortOptions,
    filters: Filters
): ApiAction => {
    let api = splitRulePoliciesApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "SPLITRULEPOLICIES_LIST",
    };
};

export const receivePageOptions = (pageOptions: PageOptions): SplitRulePolicyListPageOptionsReceiveAction => ({
    type: "SPLITRULEPOLICIES_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (sortOptions: SortOptions): SplitRulePolicyListSortOptionsReceiveAction => ({
    type: "SPLITRULEPOLICIES_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (filters: Filters): SplitRulePolicyListFiltersReceiveAction => ({
    type: "SPLITRULEPOLICIES_LIST_FILTERS_RECEIVE",
    payload: filters,
});
