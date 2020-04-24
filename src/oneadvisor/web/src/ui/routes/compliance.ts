import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";

import { loadClientLookups } from "./client";
import { loadDirectoryLookups } from "./directory";

const ensureComplianceReducer = async () => {
    if (reducerManager.hasReducer("compliance")) return;

    const reducer = await import(
        /* webpackChunkName: "compliance" */ "@/state/compliance/reducer"
    ).then((reducerModule) => reducerModule.reducer);
    reducerManager.injectReducer("compliance", reducer);

    //Load lookups
    loadClientLookups();
    loadDirectoryLookups();
};

export const RoaInvest = lazy(() =>
    import(/* webpackChunkName: "compliance" */ "@/ui/app/compliance/roa/invest/RoaInvest").then(
        async (module) => {
            await ensureComplianceReducer();
            return module;
        }
    )
);
