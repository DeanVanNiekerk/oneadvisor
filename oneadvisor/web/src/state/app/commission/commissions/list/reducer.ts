import { Filters, PageOptions, SortOptions } from "@/app/table";
import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { Commission } from "../types";
import { CommissionListAction } from "./actions";

export type State = {
    readonly items: Commission[];
    readonly totalItems: number;
    readonly sumAmountIncludingVAT: number;
    readonly sumVAT: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    sumAmountIncludingVAT: 0,
    sumVAT: 0,
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("commissionStatementDate", "asc"),
    filters: null,
};

export const reducer = (
    state: State = defaultState,
    action: CommissionListAction
): State => {
    switch (action.type) {
        case "COMMISSIONS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                sumAmountIncludingVAT: action.payload.sumAmountIncludingVAT,
                sumVAT: action.payload.sumVAT,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "COMMISSIONS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        case "COMMISSIONS_LIST_FILTERS_RECEIVE": {
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
