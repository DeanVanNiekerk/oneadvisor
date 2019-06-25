import moment from 'moment';

import { UserMonthlyCommissionAction } from './actions';
import { UserMonthlyCommissionType, UserMonthlyCommissionTypeOption } from './types';

export type State = {
    readonly year: number;
    readonly month: number;
    readonly type: UserMonthlyCommissionType;
    readonly typeOptions: UserMonthlyCommissionTypeOption[];
};

const thisMonth = moment();
export const defaultState: State = {
    year: thisMonth.year(),
    month: thisMonth.month() + 1,
    type: "Month",
    typeOptions: [
        { key: "Month", label: "Single Month" },
        { key: "YearToDate", label: "Year to Date" },
        { key: "Last12Months", label: "Last 12 Months" },
    ],
};

export const reducer = (state: State = defaultState, action: UserMonthlyCommissionAction): State => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_YEAR_RECEIVE": {
            return {
                ...state,
                year: action.payload,
            };
        }
        case "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_MONTH_RECEIVE": {
            return {
                ...state,
                month: action.payload,
            };
        }
        case "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_TYPE_RECEIVE": {
            return {
                ...state,
                type: action.payload,
            };
        }
        default:
            return state;
    }
};
