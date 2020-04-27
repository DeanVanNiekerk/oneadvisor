import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";
import { fetchAllClientLookups } from "@/state/lookups/client";

import { loadDirectoryLookups } from "./directory";

const ensureClientReducer = async () => {
    if (reducerManager.hasReducer("client")) return;

    //Inject reducer
    const reducer = await import("@/state/client/reducer").then(
        (reducerModule) => reducerModule.reducer
    );
    reducerManager.injectReducer("client", reducer);

    //Load lookups
    loadClientLookups();
    loadDirectoryLookups();
};

export const loadClientLookups = async () => {
    reducerManager.dispatch(fetchAllClientLookups());
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
export const PolicyTypeCharacteristicList = lazy(() =>
    import("@/ui/app/client/lookup/policyTypeCharacteristic/PolicyTypeCharacteristicList").then(
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
