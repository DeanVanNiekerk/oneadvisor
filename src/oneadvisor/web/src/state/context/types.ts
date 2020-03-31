import { IconName } from "@/app/types";

export type AppInfo = {
    name: string;
    version: string;
};

export type Application = {
    id: string;
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
