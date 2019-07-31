import { Menus } from "@/state/context/types";

import { CLIENT_ID, COMMISSION_ID, DIRECTORY_ID } from "./application";

export const menus: Menus = {
    [DIRECTORY_ID]: {
        relativePath: "/directory",
        groups: [
            {
                name: "Organisation",
                defaultOpen: true,
                icon: "team",
                links: [
                    {
                        name: "Users",
                        relativePath: "/users",
                        isDefault: true,
                        useCases: ["dir_view_users"],
                    },
                    {
                        name: "Organisations",
                        relativePath: "/organisations",
                        useCases: ["dir_view_organisations"],
                    },
                ],
            },
            {
                name: "Security",
                defaultOpen: false,
                icon: "safety-certificate",
                links: [
                    {
                        name: "Roles",
                        relativePath: "/roles",
                        useCases: ["dir_view_roles"],
                    },
                ],
            },
            {
                name: "Lookups",
                defaultOpen: false,
                icon: "setting",
                links: [
                    {
                        name: "Companies",
                        relativePath: "/lookups/companies",
                        useCases: ["dir_edit_lookups"],
                    },
                ],
            },
            {
                name: "Audit",
                defaultOpen: false,
                icon: "video-camera",
                links: [
                    {
                        name: "Logs",
                        relativePath: "/audit/logs",
                        useCases: ["dir_view_audit_logs"],
                    },
                ],
            },
        ],
    },

    [CLIENT_ID]: {
        relativePath: "/client",
        groups: [
            {
                name: "Management",
                defaultOpen: true,
                icon: "user",
                links: [
                    {
                        name: "Clients",
                        relativePath: "/clients",
                        isDefault: true,
                        useCases: ["clt_view_clients"],
                    },
                    {
                        name: "Policies",
                        relativePath: "/policies",
                        useCases: ["clt_view_policies"],
                    },
                ],
            },
            {
                name: "Data",
                defaultOpen: false,
                icon: "import",
                links: [
                    {
                        name: "Import",
                        relativePath: "/import",
                        useCases: ["clt_import_clients"],
                    },
                    {
                        name: "Export",
                        relativePath: "/export",
                        useCases: ["clt_export_clients"],
                    },
                ],
            },
            {
                name: "Lookups",
                defaultOpen: false,
                icon: "setting",
                links: [
                    {
                        name: "Product Types",
                        relativePath: "/lookups/policyProductTypes",
                        useCases: ["dir_edit_lookups"],
                    },
                    {
                        name: "Products",
                        relativePath: "/lookups/policyProducts",
                        useCases: ["dir_edit_lookups"],
                    },
                ],
            },
        ],
    },

    [COMMISSION_ID]: {
        relativePath: "/commission",
        groups: [
            {
                name: "Statements",
                defaultOpen: true,
                icon: "reconciliation",
                links: [
                    {
                        name: "Statements",
                        relativePath: "/statements",
                        isDefault: true,
                        useCases: ["com_view_commission_statements"],
                    },
                    {
                        name: "Commission Entries",
                        relativePath: "/commissionEntries",
                        useCases: ["com_view_commissions"],
                    },
                    {
                        name: "Commission Split Rules",
                        relativePath: "/commissionSplitRulePolicies",
                        useCases: ["com_view_commission_split_rules"],
                    },
                    {
                        name: "Templates",
                        relativePath: "/templates",
                        useCases: ["com_view_commission_statement_templates"],
                    },
                ],
            },
            {
                name: "Reports",
                defaultOpen: true,
                icon: "line-chart",
                links: [
                    {
                        name: "Client Revenue",
                        relativePath: "/reports/revenueClient",
                        useCases: ["com_view_report_client_revenue"],
                    },
                    {
                        name: "Broker Commission",
                        relativePath: "/reports/userMonthlyCommission",
                        useCases: ["com_view_report_user_monthly_commission"],
                    },
                    {
                        name: "Projections",
                        relativePath: "/reports/projections",
                        useCases: ["com_view_report_past_revenue_commission"],
                    },
                ],
            },
            {
                name: "Lookups",
                defaultOpen: false,
                icon: "setting",
                links: [
                    {
                        name: "Commission Types",
                        relativePath: "/lookups/commTypes",
                        useCases: ["dir_edit_lookups"],
                    },
                ],
            },
        ],
    },
};

export const defaultOpenGroupNames = (): string[] => {
    let groupNames: string[] = [];
    Object.keys(menus).forEach(appId => {
        groupNames = groupNames.concat(menus[appId].groups.filter(g => g.defaultOpen).map(g => g.name));
    });
    return groupNames;
};
