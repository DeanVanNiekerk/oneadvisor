import dayjs from "dayjs";

import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { ClientRevenueDataAction } from "./actions";
import { ClientRevenueDataFilters, ClientRevenueState } from "./types";

const lastMonth = dayjs().subtract(1, "month");
const defaultFilters: ClientRevenueDataFilters = {
    yearEnding: [lastMonth.year().toString()],
    monthEnding: [(lastMonth.month() + 1).toString()],
    branchId: [],
    userId: [],
    clientLastName: [],
    policyTypeId: [],
};

export const defaultState: ClientRevenueState = {
    items: [],
    fetching: false,
    itemsPaged: [],
    totalItems: 0,
    fetchingPaged: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("monthlyAnnuityMonth", "desc"),
    filters: defaultFilters,
};

export const reducer = (
    state: ClientRevenueState = defaultState,
    action: ClientRevenueDataAction
): ClientRevenueState => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_MEM_REVENUE_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }

        case "COMMISSIONS_REPORT_MEM_REVENUE_PAGED_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                itemsPaged: action.payload.items,
                fetchingPaged: false,
            };
        }
        case "COMMISSIONS_REPORT_MEM_REVENUE_PAGED_FETCHING": {
            return {
                ...state,
                fetchingPaged: true,
            };
        }
        case "COMMISSIONS_REPORT_MEM_REVENUE_PAGED_FETCHING_ERROR": {
            return {
                ...state,
                itemsPaged: [],
                fetchingPaged: false,
            };
        }

        case "COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        case "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE": {
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
