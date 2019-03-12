import moment from 'moment';

import { Filters, PageOptions, SortOptions } from '@/app/table';
import { defaultPageOptions, defaultSortOptions } from '@/app/table/defaults';

import { MemberRevenueDataAction } from './actions';
import { MemberRevenueData } from './types';

export type State = {
    readonly items: MemberRevenueData[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

const lastMonth = moment().subtract(1, "months");
const defaultFilters: Filters = {
    yearEnding: [lastMonth.year().toString()],
    monthEnding: [(lastMonth.month() + 1).toString()],
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("", "desc"),
    filters: defaultFilters,
};

export const reducer = (
    state: State = defaultState,
    action: MemberRevenueDataAction
): State => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_MEM_REVENUE_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
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
