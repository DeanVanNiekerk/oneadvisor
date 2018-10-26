import { createSelector } from 'reselect'
import { DEFAULT_APPLICATION_ID } from 'config/application'

const pathNameSelector = state => state.router.location.pathname
const appsSelector = state => state.context.applications
const menusSelector = state => state.context.menus

export const applicationsSelector = createSelector(
    pathNameSelector,
    appsSelector,
    (pathName, applications) => {

        return applications.map(app => {
            return {
                ...app,
                isCurrent: isCurrentApplication(app, pathName)
            }
        })

    }
)

export const currentApplicationSelector = createSelector(
    applicationsSelector,
    (applications) => {
        return applications.filter(app => app.isCurrent)[0]
    }
)

export const currentMenuSelector = createSelector(
    pathNameSelector,
    currentApplicationSelector,
    menusSelector,
    (pathName, application, menus) => {
        const menu = menus[application.id];

        return {
            ...menu,
            groups: menu.groups.map(group => {
                return {
                    ...group,
                    links: group.links.map(link => {
                        return {
                            ...link,
                            isCurrent: isCurrentMenuLink(menu, link, pathName)
                        }
                    })
                }

            })
        }

       
    }
)

const isCurrentApplication = (application, pathName) => {

    if(!pathName || pathName === '/') {
        if(application.id === DEFAULT_APPLICATION_ID)
            return true;
        return false;
    }

    return (pathName.indexOf(application.relativePath) !== -1);

}

const isCurrentMenuLink = (menu, link, pathName) => {

    if(!pathName || pathName === '/' || pathName === menu.relativePath) {
        if(link.isDefault)
            return true;
        return false;
    }

    return pathName === `${menu.relativePath}${link.relativePath}`;

}