// @flow

import { createSelector } from 'reselect';
import { DEFAULT_APPLICATION_ID } from '@/config/application';
import type { State as RootState } from '@/state/rootReducer';
import type { Application, Menus, Menu, MenuLink } from './types';

export const pathNameSelector = (state: RootState): string =>
    state.router ? state.router.location.pathname : '';
export const appsSelector = (state: RootState): Application[] =>
    state.context.applications;
export const menusSelector = (state: RootState): Menus => state.context.menus;

export const applicationsSelector: (
    state: RootState
) => Application[] = createSelector(
    pathNameSelector,
    appsSelector,
    (pathName, applications) => {
        return applications.map(app => {
            return {
                ...app,
                isCurrent: isCurrentApplication(app, pathName)
            };
        });
    }
);

export const currentApplicationSelector: (
    state: RootState
) => Application = createSelector(
    applicationsSelector,
    applications => {
        return applications.filter(app => app.isCurrent)[0];
    }
);

export const currentMenuSelector: (state: RootState) => Menu = createSelector(
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
                        };
                    })
                };
            })
        };
    }
);

export const currentMenuLinkSelector: (
    state: RootState
) => MenuLink = createSelector(
    currentMenuSelector,
    menu => {
        const flattened = menu.groups.reduce((links, group) => {
            links.push(...group.links);
            return links;
        }, []);
        return flattened.filter(link => link.isCurrent)[0];
    }
);

const isCurrentApplication = (application, pathName) => {
    if (!pathName || pathName === '/') {
        if (application.id === DEFAULT_APPLICATION_ID) return true;
        return false;
    }

    return pathName.indexOf(application.relativePath) !== -1;
};

const isCurrentMenuLink = (menu, link, pathName) => {
    if (!pathName || pathName === '/' || pathName === menu.relativePath) {
        if (link.isDefault) return true;
        return false;
    }

    return pathName.indexOf(`${menu.relativePath}${link.relativePath}`) === 0;
};
