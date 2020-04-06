import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";

import { ensureCommissionReducer } from "./commission";

export const ensureDirectoryReducer = async () => {
    if (reducerManager.hasReducer("directory")) return;

    //Inject reducer
    const reducer = await import("@/state/directory/reducer").then(
        (reducerModule) => reducerModule.reducer
    );
    reducerManager.injectReducer("directory", reducer);

    //Load lookups
    const fetchAllDirectoryLookups = await import("@/state/directory/lookups/all/actions").then(
        (actionsModule) => actionsModule.fetchAllDirectoryLookups
    );
    reducerManager.dispatch(fetchAllDirectoryLookups());
};

export const AuditLogList = lazy(() =>
    import("@/ui/app/directory/audit/logs/AuditLogList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
export const ChangeLogList = lazy(() =>
    import("@/ui/app/directory/changeLogs/ChangeLogList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
export const CompanyList = lazy(() =>
    import("@/ui/app/directory/lookup/company/CompanyList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
export const OrganisationList = lazy(() =>
    import("@/ui/app/directory/organisation/OrganisationList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
export const RoleList = lazy(() =>
    import("@/ui/app/directory/role/RoleList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
export const UserList = lazy(() =>
    import("@/ui/app/directory/user/UserList").then(async (module) => {
        await ensureDirectoryReducer();
        await ensureCommissionReducer();
        return module;
    })
);
export const AdviceScopeList = lazy(() =>
    import("@/ui/app/directory/lookup/adviceScope/AdviceScopeList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
export const AdviceServiceList = lazy(() =>
    import("@/ui/app/directory/lookup/adviceService/AdviceServiceList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
export const LicenseCategoryList = lazy(() =>
    import("@/ui/app/directory/lookup/licenseCategory/LicenseCategoryList").then(async (module) => {
        await ensureDirectoryReducer();
        return module;
    })
);
