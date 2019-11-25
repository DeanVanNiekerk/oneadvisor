import { lazy } from "react";

export const ClientPreview = lazy(() => import("@/ui/app/client/client/preview/ClientPreview"));
export const ClientExport = lazy(() => import("@/ui/app/client/export/ClientExport"));
export const ClientImport = lazy(() => import("@/ui/app/client/import/ClientImport"));
export const PolicyProductList = lazy(() =>
    import("@/ui/app/client/lookup/policyProduct/PolicyProductList")
);
export const PolicyProductTypeList = lazy(() =>
    import("@/ui/app/client/lookup/policyProductType/PolicyProductTypeList")
);
export const PolicyList = lazy(() => import("@/ui/app/client/policy/list/PolicyList"));
export const ClientList = lazy(() => import("@/ui/app/client/client/list/ClientList"));
