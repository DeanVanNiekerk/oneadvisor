import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";

import { ensureDirectoryReducer } from "./directory";

const ensureClientReducer = async () => {
    await ensureDirectoryReducer();

    if (reducerManager.hasReducer("client")) return;

    const reducer = await import("@/state/client/reducer").then(
        (reducerModule) => reducerModule.reducer
    );

    reducerManager.injectReducer("client", reducer);
};

export const ClientPreview = lazy(() =>
    import("@/ui/app/client/client/preview/ClientPreview").then(async (module) => {
        await ensureClientReducer();
        return module;
    })
);
export const ClientExport = lazy(() =>
    import("@/ui/app/client/export/ClientExport").then(async (module) => {
        await ensureClientReducer();
        return module;
    })
);
export const ClientImport = lazy(() =>
    import("@/ui/app/client/import/ClientImport").then(async (module) => {
        await ensureClientReducer();
        return module;
    })
);
export const PolicyProductList = lazy(() =>
    import("@/ui/app/client/lookup/policyProduct/PolicyProductList").then(async (module) => {
        await ensureClientReducer();
        return module;
    })
);
export const PolicyProductTypeList = lazy(() =>
    import("@/ui/app/client/lookup/policyProductType/PolicyProductTypeList").then(
        async (module) => {
            await ensureClientReducer();
            return module;
        }
    )
);
export const PolicyList = lazy(() =>
    import("@/ui/app/client/policy/list/PolicyList").then(async (module) => {
        await ensureClientReducer();
        return module;
    })
);
export const ClientList = lazy(() =>
    import("@/ui/app/client/client/list/ClientList").then(async (module) => {
        await ensureClientReducer();
        return module;
    })
);
