import { MenuGroup } from '@/state/context/types';

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
