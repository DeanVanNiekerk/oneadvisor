import { lazy } from "react";

export const AuditLogList = lazy(() => import("@/ui/app/directory/audit/logs/AuditLogList"));
export const ChangeLogList = lazy(() => import("@/ui/app/directory/changeLogs/ChangeLogList"));
export const CompanyList = lazy(() => import("@/ui/app/directory/lookup/company/CompanyList"));
export const OrganisationList = lazy(() =>
    import("@/ui/app/directory/organisation/OrganisationList")
);
export const RoleList = lazy(() => import("@/ui/app/directory/role/RoleList"));
export const UserList = lazy(() => import("@/ui/app/directory/user/UserList"));
