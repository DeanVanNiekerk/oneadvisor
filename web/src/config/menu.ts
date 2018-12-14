import { Menus } from '@/state/context/types';

import { DIRECTORY_ID, MEMBER_ID } from './application';

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
                        isCurrent: false
                    },
                    {
                        name: 'Organisations',
                        icon: 'bank',
                        relativePath: '/organisations',
                        isDefault: false,
                        isCurrent: false
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
                        isDefault: false,
                        isCurrent: false
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
                        isCurrent: false
                    }
                ]
            }
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
