// @flow
import type { Menus } from 'state/context/types'
import { DIRECTORY_ID, MEMBER_ID } from './application'


export const menus: Menus = {

    [DIRECTORY_ID]: {
        relativePath: "/directory",
        groups: [
            {
                name: "Management",
                links: [
                    {
                        name: "Users",
                        icon: "people",
                        relativePath: "/users",
                        isDefault: true,
                        isCurrent: false
                    },
                    {
                        name: "Organisations",
                        icon: "business",
                        relativePath: "/organisations",
                        isDefault: false,
                        isCurrent: false
                    }
                ]
            }

        ]
    },

    [MEMBER_ID]: {
        relativePath: "/member",
        groups: [
            {
                name: "Management",
                links: [
                    {
                        name: "Members",
                        icon: "people",
                        relativePath: "/members",
                        isDefault: true,
                        isCurrent: false
                    }
                ]
            }

        ]
    }
    
 




    




}