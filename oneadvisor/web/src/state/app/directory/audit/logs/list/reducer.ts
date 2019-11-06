import { defaultSortOptions, Filters, SortOptions } from "@/app/table";

import { AuditLog } from "../types";
import { AuditLogListAction } from "./actions";

export type State = {
    readonly items: AuditLog[];
    readonly limit: number;
    readonly limitReached: boolean;
    readonly fetching: boolean;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export const defaultState: State = {
    items: [],
    limit: 0,
    limitReached: false,
    fetching: false,
    sortOptions: defaultSortOptions("date", "desc"),
    filters: null,
};

export const reducer = (state: State = defaultState, action: AuditLogListAction): State => {
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
        case "AUDIT_LOGS_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
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
