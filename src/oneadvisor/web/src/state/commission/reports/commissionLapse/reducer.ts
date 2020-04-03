import moment from "moment";

import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";
import { DATE_FORMAT } from "@/app/utils";

import { CommissionCommissionLapseDataAction } from "./actions";
import { CommissionLapseDataFilters, CommissionLapseState } from "./types";

const defaultFilters: CommissionLapseDataFilters = {
    date: [moment().format(DATE_FORMAT)],
};

export const defaultState: CommissionLapseState = {
    items: [],
    fetching: false,
    totalItems: 0,
    filters: defaultFilters,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("companyId", "asc"),
};

export const reducer = (
    state: CommissionLapseState = defaultState,
    action: CommissionCommissionLapseDataAction
): CommissionLapseState => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_COMMISSIONLAPSE_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                totalItems: action.payload.totalItems,
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                totalItems: 0,
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_COMMISSIONLAPSE_FILTERS_RECEIVE": {
            return {
                ...state,
                filters: {
                    ...action.payload,
                },
            };
        }
        case "COMMISSIONS_REPORT_COMMISSIONLAPSE_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "COMMISSIONS_REPORT_COMMISSIONLAPSE_SORT_OPTIONS_RECEIVE": {
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
