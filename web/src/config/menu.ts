import { Menus } from '@/state/context/types';

import { COMMISSION_ID, DIRECTORY_ID, MEMBER_ID } from './application';

export const menus: Menus = {
    [DIRECTORY_ID]: {
        relativePath: '/directory',
        groups: [
            {
                name: 'Organisation',
                links: [
                    {
                        name: 'Users',
                        icon: 'team',
                        relativePath: '/users',
                        isDefault: true,
                        useCases: ['dir_view_users']
                    },
                    {
                        name: 'Organisations',
                        icon: 'bank',
                        relativePath: '/organisations',
                        useCases: ['dir_view_organisations']
                    }
                ]
            },
            {
                name: 'Security',
                links: [
                    {
                        name: 'Roles',
                        icon: 'safety-certificate',
                        relativePath: '/roles',
                        useCases: ['dir_view_roles']
                    }
                ]
            },
            {
                name: 'Lookups',
                links: [
                    {
                        name: 'Companies',
                        icon: 'copyright',
                        relativePath: '/lookups/companies',
                        useCases: ['dir_view_lookups']
                    },
                    {
                        name: 'Commission Types',
                        icon: 'dollar',
                        relativePath: '/lookups/commTypes',
                        useCases: ['dir_view_lookups']
                    }
                ]
            },
            {
                name: 'Audit',
                links: [
                    {
                        name: 'Logs',
                        icon: 'video-camera',
                        relativePath: '/audit/logs',
                        useCases: ['dir_view_audit_logs']
                    }
                ]
            }
        ]
    },

    [MEMBER_ID]: {
        relativePath: '/member',
        groups: [
            {
                name: 'Management',
                links: [
                    {
                        name: 'Members',
                        icon: 'user',
                        relativePath: '/members',
                        isDefault: true,
                        useCases: ['mem_view_members']
                    }
                ]
            },
            {
                name: 'Data',
                links: [
                    {
                        name: 'Import',
                        icon: 'upload',
                        relativePath: '/import',
                        useCases: ['mem_import_members']
                    },
                    {
                        name: 'Export',
                        icon: 'download',
                        relativePath: '/export',
                        useCases: ['mem_export_members']
                    }
                ]
            }
        ]
    },

    [COMMISSION_ID]: {
        relativePath: '/commission',
        groups: [
            {
                name: 'Management',
                links: [
                    {
                        name: 'Statements',
                        icon: 'table',
                        relativePath: '/statements',
                        isDefault: true,
                        useCases: ['com_view_commission_statements']
                    }
                ]
            }
            // {
            //     name: 'Data',
            //     links: [
            //         {
            //             name: 'Import',
            //             icon: 'cloud-upload',
            //             relativePath: '/import',
            //             useCases: ['com_import_commissions']
            //         }
            //     ]
            // }
        ]
    }
};

export const allGroupNames = (): string[] => {
    let groupNames: string[] = [];
    Object.keys(menus).forEach(appId => {
        groupNames = groupNames.concat(menus[appId].groups.map(g => g.name));
    });
    return groupNames;
};
