import { Filters } from "@/app/table";

export type AuditLog = {
    id: string;
    userId: string | null;
    date: string;
    action: string;
    entity: string | null;
    data: any | null;
};

export type AuditLogItems = {
    items: AuditLog[];
    limit: number;
    limitReached: boolean;
};

export type AuditLogFilters = Filters<Pick<AuditLog, "userId" | "date" | "action" | "entity">>;
