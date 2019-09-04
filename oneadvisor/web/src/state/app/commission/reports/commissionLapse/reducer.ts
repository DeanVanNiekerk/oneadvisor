import moment from "moment";

import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";
import { PageOptions, SortOptions } from "@/app/table/types";
import { DATE_FORMAT } from "@/app/utils";

import { CommissionCommissionLapseDataAction } from "./actions";
import { CommissionLapseData, CommissionLapseDataFilters } from "./types";

export type State = {
    readonly items: CommissionLapseData[];
    readonly fetching: boolean;
    readonly totalItems: number;
    readonly filters: CommissionLapseDataFilters | null;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
};

const defaultFilters: CommissionLapseDataFilters = {
    date: [
        moment().format(DATE_FORMAT),
    ],
};

export const defaultState: State = {
    items: [],
    fetching: false,
    totalItems: 0,
    filters: defaultFilters,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("Number", "desc"),
};

export const reducer = (state: State = defaultState, action: CommissionCommissionLapseDataAction): State => {
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
