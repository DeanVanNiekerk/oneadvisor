import { IconName } from "@/app/types";

import { OrganisationEdit } from "../directory/organisations/types";

export type AppInfo = {
    name: string;
    version: string;
};

export type RootNavigationItem = {
    applicationId: string;
    name: string;
    color: string;
    relativePath: string;
    icon: IconName;
    isCurrent: boolean;
};

export type Menus = {
    [key: string]: Menu;
};

export type Menu = {
    relativePath: string;
    groups: MenuGroup[];
};

export type MenuGroup = {
    name: string;
    defaultOpen: boolean;
    icon: IconName;
    links: MenuLink[];
};

export type MenuLink = {
    name: string;
    relativePath: string;
    isDefault?: boolean;
    isCurrent?: boolean;
    useCases?: string[];
    roles?: string[];
};

export type Application = {
    id: string;
    name: string;
    colourHex: string;
};

export type ContextState = {
    readonly appInfo: AppInfo | null;
    readonly organisation: OrganisationEdit | null;
    readonly rootNavigationItems: RootNavigationItem[];
    readonly menus: Menus;
    readonly applications: Application[];
};
