import { Filters, PageOptions, SortOptions } from "@/app/table";
import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { CommissionError } from "../types";
import { ErrorListAction } from "./actions";

export type State = {
    readonly items: CommissionError[];
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
    sortOptions: defaultSortOptions("", "desc"),
    filters: null,
};

export const reducer = (state: State = defaultState, action: ErrorListAction): State => {
    switch (action.type) {
        case "COMMISSIONS_ERRORS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "COMMISSIONS_ERRORS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_ERRORS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "COMMISSIONS_ERRORS_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        default:
            return state;
    }
};
