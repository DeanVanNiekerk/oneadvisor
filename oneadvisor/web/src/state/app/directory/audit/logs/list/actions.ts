import { ThunkAction } from "redux-thunk";

import { appendFiltersQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { auditApi } from "@/config/api/directory";
import { RootState } from "@/state/rootReducer";

import { auditLogsSelector } from "../";
import { AuditLogItems } from "../types";

type AuditLogListReceiveAction = {
    type: "AUDIT_LOGS_LIST_RECEIVE";
    payload: AuditLogItems;
};
type AuditLogListFetchingAction = { type: "AUDIT_LOGS_LIST_FETCHING" };
type AuditLogListFetchingErrorAction = {
    type: "AUDIT_LOGS_LIST_FETCHING_ERROR";
};
type AuditLogListSortOptionsReceiveAction = {
    type: "AUDIT_LOGS_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};
type AuditLogListFiltersReceiveAction = {
    type: "AUDIT_LOGS_LIST_FILTERS_RECEIVE";
    payload: Filters;
};

export type AuditLogListAction =
    | AuditLogListReceiveAction
    | AuditLogListFetchingAction
    | AuditLogListFetchingErrorAction
    | AuditLogListSortOptionsReceiveAction
    | AuditLogListFiltersReceiveAction;

export const fetchAuditLogs = (): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {

        let { sortOptions, filters } = auditLogsSelector(getState());

        let api = `${auditApi}/logs`;
        api = appendSortOptionQuery(api, sortOptions);
        api = appendFiltersQuery(api, filters);

        return dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "AUDIT_LOGS_LIST",
        });
    };
};

export const receiveSortOptions = (sortOptions: SortOptions): AuditLogListSortOptionsReceiveAction => ({
    type: "AUDIT_LOGS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (filters: Filters): AuditLogListFiltersReceiveAction => ({
    type: "AUDIT_LOGS_LIST_FILTERS_RECEIVE",
    payload: filters,
});
