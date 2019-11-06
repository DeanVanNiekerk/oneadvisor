import { ThunkAction } from "redux-thunk";

import { appendFiltersQuery } from "@/app/query";
import { Filters } from "@/app/table";
import { ApiAction } from "@/app/types";
import { auditApi } from "@/config/api/directory";
import { RootState } from "@/state/rootReducer";

import { auditLogsSelector } from "../";
import { AuditLogFilters, AuditLogItems } from "../types";

type AuditLogListReceiveAction = {
    type: "AUDIT_LOGS_LIST_RECEIVE";
    payload: AuditLogItems;
};
type AuditLogListFetchingAction = { type: "AUDIT_LOGS_LIST_FETCHING" };
type AuditLogListFetchingErrorAction = {
    type: "AUDIT_LOGS_LIST_FETCHING_ERROR";
};
type AuditLogListFiltersReceiveAction = {
    type: "AUDIT_LOGS_LIST_FILTERS_RECEIVE";
    payload: AuditLogFilters;
};

export type AuditLogListAction =
    | AuditLogListReceiveAction
    | AuditLogListFetchingAction
    | AuditLogListFetchingErrorAction
    | AuditLogListFiltersReceiveAction;

export const fetchAuditLogs = (): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {

        const { filters } = auditLogsSelector(getState());

        const mappedFilters = mapFilters(filters);

        let api = `${auditApi}/logs`;
        api = appendFiltersQuery(api, mappedFilters);

        return dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "AUDIT_LOGS_LIST",
        });
    };
};

const mapFilters = (filters: AuditLogFilters | null): Filters | null => {

    if (!filters)
        return filters;

    if (filters.date && filters.date.length == 2) {
        const dateFilters = {
            startDate: [filters.date[0]],
            endDate: [filters.date[1]],
        }

        const mappedFilters = {
            ...filters
        };

        delete mappedFilters.date;

        return {
            ...mappedFilters,
            ...dateFilters,
        }
    }

    return filters;
}

export const receiveFilters = (filters: AuditLogFilters): AuditLogListFiltersReceiveAction => ({
    type: "AUDIT_LOGS_LIST_FILTERS_RECEIVE",
    payload: filters,
});
