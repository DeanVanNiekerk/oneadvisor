import { AuditLog } from "../types";
import { AuditLogListAction } from "./actions";

export type State = {
    readonly items: AuditLog[];
    readonly limitReached: boolean;
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    limitReached: false,
    fetching: false,
};

export const reducer = (state: State = defaultState, action: AuditLogListAction): State => {
    switch (action.type) {
        case "AUDIT_LOGS_HISTORY_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                limitReached: action.payload.limitReached,
                fetching: false,
            };
        }
        case "AUDIT_LOGS_HISTORY_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "AUDIT_LOGS_HISTORY_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                limitReached: false,
                fetching: false,
            };
        }
        default:
            return state;
    }
};
