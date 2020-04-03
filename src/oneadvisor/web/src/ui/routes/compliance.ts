import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";

const ensureComplianceReducer = async () => {
    if (reducerManager.hasReducer("compliance")) return;

    const reducer = await import("@/state/compliance/reducer").then(
        (reducerModule) => reducerModule.reducer
    );

    reducerManager.injectReducer("compliance", reducer);
};

export const TestPage = lazy(() =>
    import("@/ui/app/compliance/TestPage").then(async (module) => {
        await ensureComplianceReducer();
        return module;
    })
);
