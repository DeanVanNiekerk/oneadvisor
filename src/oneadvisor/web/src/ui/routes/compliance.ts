import { lazy } from "react";

import { injectReducer } from "@/state/configureStore";

export const TestPage = lazy(() =>
    import("@/ui/app/compliance/TestPage").then(async (module) => {
        const reducer = await import("@/state/compliance/reducer").then(
            (reducerModule) => reducerModule.reducer
        );

        injectReducer("compliance", reducer);

        return module;
    })
);
