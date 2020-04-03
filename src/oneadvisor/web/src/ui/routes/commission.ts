import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";

const ensureCommissionReducer = async () => {
    if (reducerManager.hasReducer("commission")) return;

    const reducer = await import("@/state/commission/reducer").then(
        (reducerModule) => reducerModule.reducer
    );

    reducerManager.injectReducer("commission", reducer);
};

export const CommissionList = lazy(() =>
    import("@/ui/app/commission/commission/CommissionList").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);

export const CommissionTypeList = lazy(() =>
    import("@/ui/app/commission/lookup/commissionType/CommissionTypeList").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const ClientRevenueReport = lazy(() =>
    import("@/ui/app/commission/reports/clientRevenue/ClientRevenueReport").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const CommissionLapseReport = lazy(() =>
    import("@/ui/app/commission/reports/commissionLapse/CommissionLapseReport").then(
        async (module) => {
            await ensureCommissionReducer();
            return module;
        }
    )
);
export const ProjectionsReport = lazy(() =>
    import("@/ui/app/commission/reports/projections/ProjectionsReport").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const UserMonthlyCommissionReport = lazy(() =>
    import("@/ui/app/commission/reports/userMonthlyCommission/UserMonthlyCommissionReport").then(
        async (module) => {
            await ensureCommissionReducer();
            return module;
        }
    )
);
export const SplitRulePolicyList = lazy(() =>
    import("@/ui/app/commission/splitRulePolicy/SplitRulePolicyList").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const StatementList = lazy(() =>
    import("@/ui/app/commission/statement/list/StatementList").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const StatementPreview = lazy(() =>
    import("@/ui/app/commission/statement/preview/StatementPreview").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const CommissionStatementTemplateList = lazy(() =>
    import("@/ui/app/commission/template/TemplateList").then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
