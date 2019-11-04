import moment from "moment";

import { SERVER_DATE_FORMAT } from "@/app/utils";

import { UserCompanyMonthlyCommissionDataAction } from "./actions";
import { UserCompanyMonthlyCommissionData, UserCompanyMonthlyCommissionFilters } from "./types";

export type State = {
    readonly items: UserCompanyMonthlyCommissionData[];
    readonly fetching: boolean;
    readonly filters: UserCompanyMonthlyCommissionFilters | null;
};

const thisMonth = moment();
const defaultFilters: UserCompanyMonthlyCommissionFilters = {
    userId: [],
    companyId: [],
    startDate: [thisMonth.startOf("month").format(SERVER_DATE_FORMAT)],
    endDate: [thisMonth.endOf("month").format(SERVER_DATE_FORMAT)],
};

export const defaultState: State = {
    items: [],
    fetching: false,
    filters: defaultFilters,
};

export const reducer = (state: State = defaultState, action: UserCompanyMonthlyCommissionDataAction): State => {
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
