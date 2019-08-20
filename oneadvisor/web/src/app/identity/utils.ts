import { MenuGroup } from "@/state/context/types";

export const hasUseCase = (
    sourceUseCase: string | undefined,
    useCases: string[]
): boolean => {
    let found = true;
    if (sourceUseCase) found = useCases.indexOf(sourceUseCase) !== -1;
    return found;
};

export const hasUseCases = (
    sourceUseCases: string[] | undefined,
    useCases: string[]
): boolean => {
    let found = true;
    if (sourceUseCases)
        found = sourceUseCases.some(sourceUseCase => hasUseCase(sourceUseCase, useCases));
    return found;
};




export const hasRole = (
    sourceRole: string | undefined,
    roles: string[]
): boolean => {
    let found = true;
    if (sourceRole) found = roles.indexOf(sourceRole) !== -1;
    return found;
};

export const hasRoles = (
    sourceRoles: string[] | undefined,
    roles: string[]
): boolean => {
    let found = true;
    if (sourceRoles)
        found = sourceRoles.some(sourceRole => hasRole(sourceRole, roles));
    return found;
};



export const hasPermissionsMenuGroup = (
    menuGroup: MenuGroup,
    useCases: string[],
    roles: string[]
): boolean => {
    return menuGroup.links.some(link =>
        hasUseCases(link.useCases, useCases) && hasRoles(link.roles, roles)
    );
};

export const hasPermissionsMenuGroups = (
    menuGroups: MenuGroup[],
    useCases: string[],
    roles: string[]
): boolean => {
    return menuGroups.some(group => hasPermissionsMenuGroup(group, useCases, roles));
};
