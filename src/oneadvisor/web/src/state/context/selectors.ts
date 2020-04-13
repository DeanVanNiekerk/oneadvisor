import { createSelector } from "reselect";

import { DEFAULT_APPLICATION_ID } from "@/config/application";
import { RootState } from "@/state";

import { Application, ContextState, Menu, MenuLink, Menus, RootNavigationItem } from "./types";

const rootSelector = (state: RootState): ContextState => state.context;

export const contextSelector: (state: RootState) => ContextState = createSelector(
    rootSelector,
    (root) => root
);

export const applicationsSelector: (state: RootState) => Application[] = createSelector(
    contextSelector,
    (root) => root.applications
);

export const pathNameSelector = (state: RootState): string => {
    //@ts-ignore
    return state.router ? state.router.location.pathname : "";
};
export const navItemsSelector = (state: RootState): RootNavigationItem[] =>
    state.context.rootNavigationItems;

export const menusSelector = (state: RootState): Menus => state.context.menus;

export const rootNavigationItemsSelector: (
    state: RootState
) => RootNavigationItem[] = createSelector(
    pathNameSelector,
    navItemsSelector,
    applicationsSelector,
    (pathName, rootNavigationItems, applications) => {
        return rootNavigationItems.map((item) => {
            const application = applications.find((a) => a.id === item.applicationId);

            return {
                ...item,
                color: application ? application.colourHex : "#FFFFFF",
                isCurrent: isCurrentRootNavigationItemSelector(item, pathName),
            };
        });
    }
);

export const currentRootNavigationItemSelector: (
    state: RootState
) => RootNavigationItem = createSelector(rootNavigationItemsSelector, (rootNavigationItems) => {
    return rootNavigationItems.filter((app) => app.isCurrent)[0];
});

export const currentMenuSelector: (state: RootState) => Menu = createSelector(
    pathNameSelector,
    currentRootNavigationItemSelector,
    menusSelector,
    (pathName, rootNavigationItem, menus) => {
        if (!rootNavigationItem) return { relativePath: pathName, groups: [] };

        const menu = menus[rootNavigationItem.applicationId];

        return {
            ...menu,
            groups: menu.groups.map((group) => {
                return {
                    ...group,
                    links: group.links.map((link) => {
                        return {
                            ...link,
                            isCurrent: isCurrentMenuLink(menu, link, pathName),
                        };
                    }),
                };
            }),
        };
    }
);

export const currentMenuLinkSelector: (state: RootState) => MenuLink = createSelector(
    currentMenuSelector,
    (menu) => {
        const flattened = menu.groups.reduce((links, group) => {
            links.push(...group.links);
            return links;
        }, [] as MenuLink[]);
        return flattened.filter((link) => link.isCurrent)[0];
    }
);

const isCurrentRootNavigationItemSelector = (item: RootNavigationItem, pathName: string) => {
    if (!pathName || pathName === "/") {
        if (item.applicationId === DEFAULT_APPLICATION_ID) return true;
        return false;
    }

    return pathName.indexOf(item.relativePath) !== -1;
};

const isCurrentMenuLink = (menu: Menu, link: MenuLink, pathName: string) => {
    if (!pathName || pathName === "/" || pathName === menu.relativePath) {
        if (link.isDefault) return true;
        return false;
    }

    return pathName.indexOf(`${menu.relativePath}${link.relativePath}`) === 0;
};

export const isLoadingSelector: (state: RootState) => boolean = createSelector(
    contextSelector,
    (root) => root.applications.length === 0 || root.appInfo === null
);
