export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    organisationId: string;
    organisationName: string;
    branchId: string;
    branchName: string;
    scope: number;
};

export type UserEdit = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    branchId: string;
    roles: string[];
    scope: number;
    aliases: string[];
};
