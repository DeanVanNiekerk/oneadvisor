import { lazy } from "react";

export const CommissionList = lazy(() => import("@/ui/app/commission/commission/CommissionList"));
export const CommissionTypeList = lazy(() =>
    import("@/ui/app/commission/lookup/commissionType/CommissionTypeList")
);
export const ClientRevenueReport = lazy(() =>
    import("@/ui/app/commission/reports/clientRevenue/ClientRevenueReport")
);
export const CommissionLapseReport = lazy(() =>
    import("@/ui/app/commission/reports/commissionLapse/CommissionLapseReport")
);
export const ProjectionsReport = lazy(() =>
    import("@/ui/app/commission/reports/projections/ProjectionsReport")
);
export const UserMonthlyCommissionReport = lazy(() =>
    import("@/ui/app/commission/reports/userMonthlyCommission/UserMonthlyCommissionReport")
);
export const SplitRulePolicyList = lazy(() =>
    import("@/ui/app/commission/splitRulePolicy/SplitRulePolicyList")
);
export const StatementList = lazy(() => import("@/ui/app/commission/statement/list/StatementList"));
export const StatementPreview = lazy(() =>
    import("@/ui/app/commission/statement/preview/StatementPreview")
);
export const CommissionStatementTemplateList = lazy(() =>
    import("@/ui/app/commission/template/TemplateList")
);
