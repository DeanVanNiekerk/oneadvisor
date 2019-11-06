import { defaultPageOptions, defaultSortOptions, Filters, PageOptions, SortOptions } from "@/app/table";

import { SplitRulePolicyInfo } from "../types";
import { SplitRulePolicyListAction } from "./actions";

export type State = {
    readonly totalItems: number;
    readonly items: SplitRulePolicyInfo[];
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export const defaultState: State = {
    totalItems: 0,
    items: [],
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("", "desc"),
    filters: null,
};

export const reducer = (state: State = defaultState, action: SplitRulePolicyListAction): State => {
    switch (action.type) {
        case "SPLITRULEPOLICIES_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "SPLITRULEPOLICIES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "SPLITRULEPOLICIES_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "SPLITRULEPOLICIES_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "SPLITRULEPOLICIES_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        case "SPLITRULEPOLICIES_LIST_FILTERS_RECEIVE": {
            return {
                ...state,
                filters: {
                    ...action.payload,
                },
            };
        }
        default:
            return state;
    }
};
