import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";

import { ensureDirectoryReducer } from "./directory";

const ensureComplianceReducer = async () => {
    await ensureDirectoryReducer();

    if (reducerManager.hasReducer("compliance")) return;

    const reducer = await import(
        /* webpackChunkName: "compliance" */ "@/state/compliance/reducer"
    ).then((reducerModule) => reducerModule.reducer);

    reducerManager.injectReducer("compliance", reducer);
};

export const TestPage = lazy(() =>
    import(/* webpackChunkName: "compliance" */ "@/ui/app/compliance/TestPage").then(
        async (module) => {
            await ensureComplianceReducer();
            return module;
        }
    )
);
