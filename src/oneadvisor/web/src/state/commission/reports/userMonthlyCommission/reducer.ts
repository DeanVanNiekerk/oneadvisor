import moment from "moment";

import { UserMonthlyCommissionAction } from "./actions";
import { UserMonthlyCommissionState } from "./types";

const thisMonth = moment();
export const defaultState: UserMonthlyCommissionState = {
    year: thisMonth.year(),
    month: thisMonth.month() + 1,
    type: "Month",
    typeOptions: [
        { key: "Month", label: "Single Month" },
        { key: "YearToDate", label: "Year to Date" },
        { key: "Last12Months", label: "Last 12 Months" },
    ],
};

export const reducer = (
    state: UserMonthlyCommissionState = defaultState,
    action: UserMonthlyCommissionAction
): UserMonthlyCommissionState => {
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
