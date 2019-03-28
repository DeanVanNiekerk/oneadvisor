import { Menus } from '@/state/context/types';

import { CLIENT_ID, COMMISSION_ID, DIRECTORY_ID } from './application';

export const menus: Menus = {
    [DIRECTORY_ID]: {
        relativePath: "/directory",
        groups: [
            {
                name: "Organisation",
                links: [
                    {
                        name: "Users",
                        icon: "team",
                        relativePath: "/users",
                        isDefault: true,
                        useCases: ["dir_view_users"],
                    },
                    {
                        name: "Organisations",
                        icon: "bank",
                        relativePath: "/organisations",
                        useCases: ["dir_view_organisations"],
                    },
                ],
            },
            {
                name: "Security",
                links: [
                    {
                        name: "Roles",
                        icon: "safety-certificate",
                        relativePath: "/roles",
                        useCases: ["dir_view_roles"],
                    },
                ],
            },
            {
                name: "Lookups",
                links: [
                    {
                        name: "Companies",
                        icon: "copyright",
                        relativePath: "/lookups/companies",
                        useCases: ["dir_view_lookups"],
                    },
                    {
                        name: "Commission Types",
                        icon: "dollar",
                        relativePath: "/lookups/commTypes",
                        useCases: ["dir_view_lookups"],
                    },
                ],
            },
            {
                name: "Audit",
                links: [
                    {
                        name: "Logs",
                        icon: "video-camera",
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
                links: [
                    {
                        name: "Clients",
                        icon: "user",
                        relativePath: "/clients",
                        isDefault: true,
                        useCases: ["clt_view_clients"],
                    },
                    {
                        name: "Policies",
                        icon: "file-text",
                        relativePath: "/policies",
                        useCases: ["clt_view_policies"],
                    },
                ],
            },
            {
                name: "Data",
                links: [
                    {
                        name: "Import",
                        icon: "upload",
                        relativePath: "/import",
                        useCases: ["clt_import_clients"],
                    },
                    {
                        name: "Export",
                        icon: "download",
                        relativePath: "/export",
                        useCases: ["clt_export_clients"],
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
                links: [
                    {
                        name: "Statements",
                        icon: "reconciliation",
                        relativePath: "/statements",
                        isDefault: true,
                        useCases: ["com_view_commission_statements"],
                    },
                    {
                        name: "Templates",
                        icon: "block",
                        relativePath: "/templates",
                        useCases: ["com_view_commission_statement_templates"],
                    },
                ],
            },
            {
                name: "Reports",
                links: [
                    {
                        name: "Client Revenue",
                        icon: "line-chart",
                        relativePath: "/reports/revenueClient",
                        useCases: ["com_view_report_client_revenue"],
                    },
                ],
            },
        ],
    },
};

export const allGroupNames = (): string[] => {
    let groupNames: string[] = [];
    Object.keys(menus).forEach(appId => {
        groupNames = groupNames.concat(menus[appId].groups.map(g => g.name));
    });
    return groupNames;
};
