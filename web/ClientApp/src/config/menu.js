import { DIRECTORY_ID, MEMBER_ID } from './application'


export const menus = {

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
                        isDefault: true
                    },
                    {
                        name: "Organisations",
                        icon: "business",
                        relativePath: "/organisations",
                        isDefault: false
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
                        isDefault: true
                    }
                ]
            }

        ]
    }
    
 




    




}