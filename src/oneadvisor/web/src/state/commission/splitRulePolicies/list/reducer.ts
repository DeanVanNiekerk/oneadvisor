import { defaultPageOptions, defaultSortOptions } from "@/app/table";

import { ListState } from "../types";
import { SplitRulePolicyListAction } from "./actions";

export const defaultState: ListState = {
    totalItems: 0,
    items: [],
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("", "desc"),
    filters: null,
};

export const reducer = (
    state: ListState = defaultState,
    action: SplitRulePolicyListAction
): ListState => {
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
