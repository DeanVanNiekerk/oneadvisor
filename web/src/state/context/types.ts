export type Application = {
    id: string;
    name: string;
    color: string;
    relativePath: string;
    icon: string;
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
    links: MenuLink[];
};

export type MenuLink = {
    name: string;
    icon: string;
    relativePath: string;
    isDefault: boolean;
    isCurrent: boolean;
    useCases?: string[];
};
