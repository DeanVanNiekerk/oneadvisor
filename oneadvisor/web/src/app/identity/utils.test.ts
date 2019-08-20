import { MenuGroup } from "@/state/context/types";

import { hasRole, hasUseCase } from "./";
import { hasPermissionsMenuGroup, hasPermissionsMenuGroups, hasRoles, hasUseCases } from "./utils";

describe('utils', () => {

    describe('hasUseCase', () => {

        it('use case - undefined - true', () => {
            const result = hasUseCase(undefined, ["uc1"]);

            expect(result).toBe(true);
        });

        it('use case - exists - true', () => {
            const result = hasUseCase("uc2", ["uc1", "uc2"]);

            expect(result).toBe(true);
        });

        it('use case - doesnt exist - false', () => {
            const result = hasUseCase("uc3", ["uc1", "uc2"]);

            expect(result).toBe(false);
        });
    })

    describe('hasUseCases', () => {

        it('use cases - undefined - true', () => {
            const result = hasUseCases(undefined, ["uc1"]);

            expect(result).toBe(true);
        });

        it('use cases - exists - true', () => {
            const result = hasUseCases(["uc2"], ["uc1", "uc2"]);

            expect(result).toBe(true);
        });

        it('use cases - doesnt exist - false', () => {
            const result = hasUseCases(["uc3"], ["uc1", "uc2"]);

            expect(result).toBe(false);
        });
    })

    describe('hasRole', () => {

        it('use case - undefined - true', () => {
            const result = hasRole(undefined, ["r1"]);

            expect(result).toBe(true);
        });

        it('use case - exists - true', () => {
            const result = hasRole("r2", ["r1", "r2"]);

            expect(result).toBe(true);
        });

        it('use case - doesnt exist - false', () => {
            const result = hasRole("r3", ["r1", "r2"]);

            expect(result).toBe(false);
        });
    })

    describe('hasRoles', () => {

        it('use cases - undefined - true', () => {
            const result = hasRoles(undefined, ["r1"]);

            expect(result).toBe(true);
        });

        it('use cases - exists - true', () => {
            const result = hasRoles(["r2"], ["r1", "r2"]);

            expect(result).toBe(true);
        });

        it('use cases - doesnt exist - false', () => {
            const result = hasRoles(["r3"], ["r1", "r2"]);

            expect(result).toBe(false);
        });
    })

    describe('hasPermissionsMenuGroup', () => {

        it('1 link, no permissions - true', () => {

            const menuGroup: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                    }
                ]
            }

            const result = hasPermissionsMenuGroup(menuGroup, ["uc1"], ["r1"]);

            expect(result).toBe(true);
        });

        it('1 link, no roles, 1 use case - true', () => {

            const menuGroup: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"]
                    }
                ]
            }

            const result = hasPermissionsMenuGroup(menuGroup, ["uc1"], ["r1"]);

            expect(result).toBe(true);
        });

        it('1 link, no roles, 1 use case - false', () => {

            const menuGroup: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"]
                    }
                ]
            }

            const result = hasPermissionsMenuGroup(menuGroup, ["uc2"], ["r1"]);

            expect(result).toBe(false);
        });

        it('1 link, 1 role, 1 use case - true', () => {

            const menuGroup: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"],
                        roles: ["r1"]
                    }
                ]
            }

            const result = hasPermissionsMenuGroup(menuGroup, ["uc1"], ["r1"]);

            expect(result).toBe(true);
        });

        it('1 link, 1 role, 1 use case - false', () => {

            const menuGroup: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"],
                        roles: ["r2"]
                    }
                ]
            }

            const result = hasPermissionsMenuGroup(menuGroup, ["uc1"], ["r1"]);

            expect(result).toBe(false);
        });

        it('2 links, both not valid - false', () => {

            const menuGroup: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"],
                        roles: ["r1"]
                    },
                    {
                        name: "link2",
                        relativePath: "",
                        useCases: ["uc2"],
                        roles: ["r2"]
                    }
                ]
            }

            const result = hasPermissionsMenuGroup(menuGroup, ["uc3"], ["r3"]);

            expect(result).toBe(false);
        });

        it('2 links, 1 valid - true', () => {

            const menuGroup: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"],
                        roles: ["r1"]
                    },
                    {
                        name: "link2",
                        relativePath: "",
                        useCases: ["uc2"],
                        roles: ["r2"]
                    }
                ]
            }

            const result = hasPermissionsMenuGroup(menuGroup, ["uc2"], ["r2"]);

            expect(result).toBe(true);
        });
    });

    describe('hasPermissionsMenuGroups', () => {

        it('1 Menu Group, is not valid - false', () => {

            const menuGroup1: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"],
                        roles: ["r1"]
                    }
                ]
            };

            const groups = [menuGroup1]

            const result = hasPermissionsMenuGroups(groups, ["uc2"], ["r1"]);

            expect(result).toBe(false);
        });

        it('1 Menu Group, is valid - true', () => {

            const menuGroup1: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"],
                        roles: ["r1"]
                    }
                ]
            };

            const groups = [menuGroup1]

            const result = hasPermissionsMenuGroups(groups, ["uc1"], ["r1"]);

            expect(result).toBe(true);
        });

        it('2 Menu Group, both invalid - false', () => {

            const menuGroup1: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        roles: ["r1"]
                    }
                ]
            };

            const menuGroup2: MenuGroup = {
                name: "Test1",
                defaultOpen: false,
                icon: "icon",
                links: [
                    {
                        name: "link1",
                        relativePath: "",
                        useCases: ["uc1"],
                    }
                ]
            };

            const groups = [menuGroup1, menuGroup2]

            const result = hasPermissionsMenuGroups(groups, ["uc2"], ["r2"]);

            expect(result).toBe(false);
        });

        it('real example - false', () => {

            const groups = [
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
                            roles: ["super_administrator"],
                        },
                    ],
                },
                {
                    name: "Logs",
                    defaultOpen: false,
                    icon: "profile",
                    links: [
                        {
                            name: "Change Logs",
                            relativePath: "/logs/changeLogs",
                            roles: ["super_administrator"],
                        },
                    ],
                }
            ];

            const useCases = [
                "clt_edit_clients",
                "clt_edit_contacts",
                "clt_edit_policies",
                "clt_export_clients",
                "clt_import_clients",
                "clt_view_clients",
                "clt_view_contacts",
                "clt_view_policies",
                "com_edit_commission_allocations",
                "com_edit_commission_split_rules",
                "com_edit_commission_statements",
                "com_edit_commissions",
                "com_import_commissions",
                "com_view_commission_allocations",
                "com_view_commission_split_rules",
                "com_view_commission_statements",
                "com_view_commissions",
                "com_view_report_client_revenue",
                "com_view_report_past_revenue_commission",
                "com_view_report_user_monthly_commission"
            ]

            const result = hasPermissionsMenuGroups(groups, useCases, ["clt_administrator", "com_administrator"]);

            expect(result).toBe(false);
        });
    })
});