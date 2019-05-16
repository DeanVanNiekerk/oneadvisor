import moment from 'moment';

import { Filters } from '@/app/table';

import { UserCompanyMonthlyCommissionDataAction } from './actions';
import { UserCompanyMonthlyCommissionData } from './types';

export type State = {
    readonly items: UserCompanyMonthlyCommissionData[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly filters: Filters | null;
};

const thisMonth = moment();
const defaultFilters: Filters = {
    userId: [],
    companyId: [],
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
    action: UserCompanyMonthlyCommissionDataAction
): State => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE": {
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
