import { MenuGroup } from "@/state/context/types";

export const hasUseCase = (
    useCase: string | undefined,
    useCases: string[]
): boolean => {
    let found = true;
    if (useCase) found = useCases.indexOf(useCase) !== -1;
    return found;
};

export const hasUseCases = (
    useCases: string[] | undefined,
    allUseCases: string[]
): boolean => {
    let found = true;
    if (useCases)
        found = useCases.some(useCase => hasUseCase(useCase, allUseCases));
    return found;
};

export const hasUseCasesMenuGroup = (
    menuGroup: MenuGroup,
    allUseCases: string[]
): boolean => {
    return menuGroup.links.some(link =>
        hasUseCases(link.useCases, allUseCases)
    );
};

export const hasUseCasesMenuGroups = (
    menuGroups: MenuGroup[],
    allUseCases: string[]
): boolean => {
    return menuGroups.some(group => hasUseCasesMenuGroup(group, allUseCases));
};


export const hasRole = (
    role: string | undefined,
    roles: string[]
): boolean => {
    let found = true;
    if (role) found = roles.indexOf(role) !== -1;
    return found;
};

export const hasRoles = (
    roles: string[] | undefined,
    allRoles: string[]
): boolean => {
    let found = true;
    if (roles)
        found = roles.some(role => hasRole(role, allRoles));
    return found;
};

export const hasRolesMenuGroup = (
    menuGroup: MenuGroup,
    allRoles: string[]
): boolean => {
    return menuGroup.links.some(link =>
        hasRoles(link.roles, allRoles)
    );
};

export const hasRolesMenuGroups = (
    menuGroups: MenuGroup[],
    allRoles: string[]
): boolean => {
    return menuGroups.some(group => hasRolesMenuGroup(group, allRoles));
};
