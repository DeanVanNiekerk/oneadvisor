

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    login: string,
    email: string,
    lastLogin: string,
    lastUpdated: string,
    status: string,
    organisationId: string
};

export type UserEdit = {
    id: string,
    firstName: string,
    lastName: string,
    login: string,
    email: string,
    organisationId: string,
    roleIds: string[]
};
