import moment from "moment";

import { SERVER_DATE_FORMAT } from "@/app/utils";

import { AuditLogFilters, ListState } from "../types";
import { AuditLogListAction } from "./actions";

const startDate = moment().subtract(14, "days").startOf("day");
const endDate = moment();

const defaultFilters: AuditLogFilters = {
    date: [startDate.format(SERVER_DATE_FORMAT), endDate.format(SERVER_DATE_FORMAT)],
};

export const defaultState: ListState = {
    items: [],
    limit: 0,
    limitReached: false,
    fetching: false,
    filters: defaultFilters,
};

export const reducer = (state: ListState = defaultState, action: AuditLogListAction): ListState => {
    switch (action.type) {
        case "AUDIT_LOGS_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                limit: action.payload.limit,
                limitReached: action.payload.limitReached,
                fetching: false,
            };
        }
        case "AUDIT_LOGS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "AUDIT_LOGS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                limit: 0,
                limitReached: false,
                fetching: false,
            };
        }
        case "AUDIT_LOGS_LIST_FILTERS_RECEIVE": {
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
