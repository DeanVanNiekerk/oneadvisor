import { Filters } from "@/app/table";

export type AuditLog = {
    id: string;
    userId: string | null;
    date: string;
    action: string;
    entity: string | null;
    entityId: string | null;
    data: object | null;
};

export type AuditLogItems = {
    items: AuditLog[];
    limit: number;
    limitReached: boolean;
};

export type AuditLogFilters = Filters<
    Pick<AuditLog, "userId" | "date" | "action" | "entity" | "entityId">
>;

export type HistoryState = {
    readonly items: AuditLog[];
    readonly limitReached: boolean;
    readonly fetching: boolean;
};

export type ListState = {
    readonly items: AuditLog[];
    readonly limit: number;
    readonly limitReached: boolean;
    readonly fetching: boolean;
    readonly filters: AuditLogFilters | null;
};

export type LogsState = {
    readonly list: ListState;
    readonly history: HistoryState;
};
