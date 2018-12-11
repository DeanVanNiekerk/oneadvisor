

export type Role = {
    id: string,
    name: string,
    applicationId: string
};


export type RoleEdit = {
    id: string,
    name: string,
    applicationId: string,
    useCaseIds: string[]
};

