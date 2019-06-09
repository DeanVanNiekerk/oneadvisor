export type Scope = {
    id: number;
    name: string;
};

export const getScopes = (): Scope[] => {
    return [
        {
            id: 1,
            name: "Organisation",
        },
        {
            id: 2,
            name: "Branch",
        },
        {
            id: 3,
            name: "User",
        },
    ];
};
