import moment from "moment";

import { SERVER_DATE_FORMAT } from "@/app/utils";

import { UserEarningsTypeMonthlyCommissionDataAction } from "./actions";
import {
    UserEarningsTypeMonthlyCommissionFilters,
    UserEarningsTypeMonthlyCommissionState,
} from "./types";

const thisMonth = moment();
const defaultFilters: UserEarningsTypeMonthlyCommissionFilters = {
    userId: [],
    companyId: [],
    startDate: [thisMonth.startOf("month").format(SERVER_DATE_FORMAT)],
    endDate: [thisMonth.endOf("month").format(SERVER_DATE_FORMAT)],
};

export const defaultState: UserEarningsTypeMonthlyCommissionState = {
    items: [],
    fetching: false,
    filters: defaultFilters,
};

export const reducer = (
    state: UserEarningsTypeMonthlyCommissionState = defaultState,
    action: UserEarningsTypeMonthlyCommissionDataAction
): UserEarningsTypeMonthlyCommissionState => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE": {
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