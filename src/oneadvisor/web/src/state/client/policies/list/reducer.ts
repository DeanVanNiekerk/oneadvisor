import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { ListState } from "../types";
import { PolicyListAction } from "./actions";

export const defaultState: ListState = {
    items: [],
    totalItems: 0,
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("companyId", "asc"),
    filters: null,
};

export const reducer = (state: ListState = defaultState, action: PolicyListAction): ListState => {
    switch (action.type) {
        case "POLICIES_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "POLICIES_LIST_FETCHING": {
            return {
                ...state,
                totalItems: 0,
                items: [],
                fetching: true,
            };
        }
        case "POLICIES_LIST_FETCHING_ERROR": {
            return {
                ...state,
                totalItems: 0,
                items: [],
                fetching: false,
            };
        }
        case "POLICIES_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "POLICIES_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        case "POLICIES_LIST_FILTERS_RECEIVE": {
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
