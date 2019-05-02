import moment from 'moment';

import { Filters } from '@/app/table';

import { UserMonthlyCommissionDataAction } from './actions';
import { UserMonthlyCommissionData } from './types';

export type State = {
    readonly items: UserMonthlyCommissionData[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly filters: Filters | null;
};

const thisMonth = moment();
const defaultFilters: Filters = {
    year: [thisMonth.year().toString()],
    month: [(thisMonth.month() + 1).toString()],
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    fetching: false,
    filters: defaultFilters,
};

export const reducer = (
    state: State = defaultState,
    action: UserMonthlyCommissionDataAction
): State => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FILTERS_RECEIVE": {
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
