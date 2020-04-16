import { lazy } from "react";

import { reducerManager } from "@/state/configureStore";

import { ensureClientReducer } from "./client";
import { ensureDirectoryReducer } from "./directory";

export const ensureCommissionReducer = async () => {
    await ensureDirectoryReducer();
    await ensureClientReducer();

    if (reducerManager.hasReducer("commission")) return;

    //Inject reducer
    const reducer = await import(
        /* webpackChunkName: "commission" */ "@/state/commission/reducer"
    ).then((reducerModule) => reducerModule.reducer);
    reducerManager.injectReducer("commission", reducer);

    //Load lookups
    const fetchAllCommissionLookups = await import(
        /* webpackChunkName: "commission" */ "@/state/commission/lookups/all/actions"
    ).then((actionsModule) => actionsModule.fetchAllCommissionLookups);
    reducerManager.dispatch(fetchAllCommissionLookups());
};

export const CommissionList = lazy(() =>
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/commission/CommissionList"
    ).then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);

export const CommissionTypeList = lazy(() =>
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/lookup/commissionType/CommissionTypeList"
    ).then(async (module) => {
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
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/reports/commissionLapse/CommissionLapseReport"
    ).then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const ProjectionsReport = lazy(() =>
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/reports/projections/ProjectionsReport"
    ).then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const UserMonthlyCommissionReport = lazy(() =>
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/reports/userMonthlyCommission/UserMonthlyCommissionReport"
    ).then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const SplitRulePolicyList = lazy(() =>
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/splitRulePolicy/SplitRulePolicyList"
    ).then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const StatementList = lazy(() =>
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/statement/list/StatementList"
    ).then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const StatementPreview = lazy(() =>
    import(
        /* webpackChunkName: "commission" */ "@/ui/app/commission/statement/preview/StatementPreview"
    ).then(async (module) => {
        await ensureCommissionReducer();
        return module;
    })
);
export const CommissionStatementTemplateList = lazy(() =>
    import(/* webpackChunkName: "commission" */ "@/ui/app/commission/template/TemplateList").then(
        async (module) => {
            await ensureCommissionReducer();
            return module;
        }
    )
);
