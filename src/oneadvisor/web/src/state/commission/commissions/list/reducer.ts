import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { ListState } from "../types";
import { CommissionListAction } from "./actions";

export const defaultState: ListState = {
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
    state: ListState = defaultState,
    action: CommissionListAction
): ListState => {
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
