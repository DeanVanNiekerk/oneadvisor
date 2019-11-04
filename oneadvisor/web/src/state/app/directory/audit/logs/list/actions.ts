import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { auditApi } from "@/config/api/directory";

import { AuditLog } from "../types";

type AuditLogListReceiveAction = {
    type: "AUDIT_LOGS_LIST_RECEIVE";
    payload: PagedItems<AuditLog>;
};
type AuditLogListFetchingAction = { type: "AUDIT_LOGS_LIST_FETCHING" };
type AuditLogListFetchingErrorAction = {
    type: "AUDIT_LOGS_LIST_FETCHING_ERROR";
};
type AuditLogListPageOptionsReceiveAction = {
    type: "AUDIT_LOGS_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
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
    | AuditLogListPageOptionsReceiveAction
    | AuditLogListSortOptionsReceiveAction
    | AuditLogListFiltersReceiveAction;

export const fetchAuditLogs = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters): ApiAction => {
    let api = `${auditApi}/logs`;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "AUDIT_LOGS_LIST",
    };
};

export const receivePageOptions = (pageOptions: PageOptions): AuditLogListPageOptionsReceiveAction => ({
    type: "AUDIT_LOGS_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (sortOptions: SortOptions): AuditLogListSortOptionsReceiveAction => ({
    type: "AUDIT_LOGS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const receiveFilters = (filters: Filters): AuditLogListFiltersReceiveAction => ({
    type: "AUDIT_LOGS_LIST_FILTERS_RECEIVE",
    payload: filters,
});
