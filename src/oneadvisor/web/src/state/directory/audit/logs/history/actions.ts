import { appendFiltersQuery } from "@/app/query";
import { ApiAction } from "@/app/types";
import { auditApi } from "@/config/api/directory";

import { AuditLogFilters, AuditLogItems } from "../types";

type AuditLogHistoryReceiveAction = {
    type: "AUDIT_LOGS_HISTORY_RECEIVE";
    payload: AuditLogItems;
};
type AuditLogHistoryFetchingAction = { type: "AUDIT_LOGS_HISTORY_FETCHING" };
type AuditLogHistoryFetchingErrorAction = {
    type: "AUDIT_LOGS_HISTORY_FETCHING_ERROR";
};

export type AuditLogHistoryAction =
    | AuditLogHistoryReceiveAction
    | AuditLogHistoryFetchingAction
    | AuditLogHistoryFetchingErrorAction;

export const fetchAuditHistory = (entity: string, entityId: string): ApiAction => {
    const filters: AuditLogFilters = {
        entity: [entity],
        entityId: [entityId],
    };

    let api = `${auditApi}/logs`;
    api = appendFiltersQuery(api, filters);

    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "AUDIT_LOGS_LIST",
    };
};
