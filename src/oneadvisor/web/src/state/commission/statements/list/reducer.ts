import moment from "moment";

import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { ListState } from "../types";
import { StatementListAction } from "./actions";

export const defaultState: ListState = {
    items: [],
    totalItems: 0,
    sumAmountIncludingVAT: 0,
    sumVAT: 0,
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("companyId", "asc"),
    filterMonth: moment().month() + 1,
    filterYear: moment().year(),
    filters: null,
};

export const reducer = (
    state: ListState = defaultState,
    action: StatementListAction
): ListState => {
    switch (action.type) {
        case "STATEMENTS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                sumAmountIncludingVAT: action.payload.sumAmountIncludingVAT,
                sumVAT: action.payload.sumVAT,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "STATEMENTS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "STATEMENTS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "STATEMENTS_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        case "STATEMENTS_LIST_FILTERS_RECEIVE": {
            return {
                ...state,
                filters: {
                    ...action.payload,
                },
            };
        }
        case "STATEMENTS_LIST_FILTERS_MONTH_RECEIVE": {
            return {
                ...state,
                filterMonth: action.payload,
            };
        }
        case "STATEMENTS_LIST_FILTERS_YEAR_RECEIVE": {
            return {
                ...state,
                filterYear: action.payload,
            };
        }
        default:
            return state;
    }
};
