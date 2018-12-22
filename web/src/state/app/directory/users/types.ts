export type User = {
    id: string;
    firstName: string;
    lastName: string;
    login: string;
    email: string;
    lastLogin: string;
    lastUpdated: string;
    status: string;
    organisationId: string;
    branchId: string;
    IsSynced: boolean;
};

export type UserEdit = {
    id: string;
    firstName: string;
    lastName: string;
    login: string;
    email: string;
    branchId: string;
    roleIds: string[];
};
