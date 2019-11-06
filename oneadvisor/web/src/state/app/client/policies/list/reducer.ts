import { Filters, PageOptions, SortOptions } from "@/app/table";
import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { Policy } from "../types";
import { PolicyListAction } from "./actions";

export type State = {
    readonly items: Policy[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("companyId", "asc"),
    filters: null,
};

export const reducer = (state: State = defaultState, action: PolicyListAction): State => {
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
