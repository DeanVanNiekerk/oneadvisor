export type Scope = {
    id: number;
    name: string;
};

export const getScopes = (): Scope[] => {
    return [
        {
            id: 1,
            name: 'Organisation'
        },
        {
            id: 2,
            name: 'Branch'
        },
        {
            id: 3,
            name: 'User'
        }
    ];
};

export const getScopeName = (scope: number): string => {
    const match = getScopes().find(s => s.id >= scope);
    if (!match) return 'No mapping';
    return match.name;
};
