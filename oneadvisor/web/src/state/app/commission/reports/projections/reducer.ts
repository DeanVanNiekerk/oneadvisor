import moment from "moment";

import { DATE_FORMAT } from "@/app/utils";

import { CommissionProjectionsDataAction } from "./actions";
import { PastRevenueCommissionData, PastRevenueCommissionDataFilters } from "./types";

export type State = {
    readonly items: PastRevenueCommissionData[];
    readonly fetching: boolean;
    readonly filters: PastRevenueCommissionDataFilters | null;
};

const defaultFilters: PastRevenueCommissionDataFilters = {
    startDate: [
        moment()
            .subtract(3, "months")
            .startOf("month")
            .format(DATE_FORMAT),
    ],
    endDate: [
        moment()
            .endOf("month")
            .format(DATE_FORMAT),
    ],
};

export const defaultState: State = {
    items: [],
    fetching: false,
    filters: defaultFilters,
};

export const reducer = (state: State = defaultState, action: CommissionProjectionsDataAction): State => {
    switch (action.type) {
        case "COMMISSIONS_REPORT_PROJECTIONS_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_PROJECTIONS_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_REPORT_PROJECTIONS_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "COMMISSIONS_REPORT_PROJECTIONS_FILTERS_RECEIVE": {
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
