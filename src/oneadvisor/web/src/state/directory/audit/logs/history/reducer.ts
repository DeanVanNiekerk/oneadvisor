import { HistoryState } from "../types";
import { AuditLogHistoryAction } from "./actions";

export const defaultState: HistoryState = {
    items: [],
    limitReached: false,
    fetching: false,
};

export const reducer = (
    state: HistoryState = defaultState,
    action: AuditLogHistoryAction
): HistoryState => {
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
