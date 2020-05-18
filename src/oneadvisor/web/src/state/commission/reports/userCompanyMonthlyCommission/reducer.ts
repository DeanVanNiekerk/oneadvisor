import dayjs from "dayjs";

import { SERVER_DATE_FORMAT } from "@/app/utils";

import { UserCompanyMonthlyCommissionDataAction } from "./actions";
import { UserCompanyMonthlyCommissionFilters, UserCompanyMonthlyCommissionState } from "./types";

const thisMonth = dayjs();
const defaultFilters: UserCompanyMonthlyCommissionFilters = {
    userId: [],
    companyId: [],
    branchId: [],
    startDate: [thisMonth.startOf("month").format(SERVER_DATE_FORMAT)],
    endDate: [thisMonth.endOf("month").format(SERVER_DATE_FORMAT)],
};

export const defaultState: UserCompanyMonthlyCommissionState = {
    items: [],
    fetching: false,
    filters: defaultFilters,
};

export const reducer = (
    state: UserCompanyMonthlyCommissionState = defaultState,
    action: UserCompanyMonthlyCommissionDataAction
): UserCompanyMonthlyCommissionState => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_RECEIVE": {
            return {
                ...state,
                items: action.payload,
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
