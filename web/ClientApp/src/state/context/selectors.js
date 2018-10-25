import { createSelector } from 'reselect'
import { DEFAULT_APPLICATION_ID } from 'config/application'

const pathNameSelector = state => state.router.location.pathname
const appsSelector = state => state.context.applications

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

const isCurrentApplication = (application, pathName) => {

    if(!pathName) {
        if(application.id === DEFAULT_APPLICATION_ID)
            return true;
        return false;
    }

    return (pathName.indexOf(application.relativePath) !== -1);

}