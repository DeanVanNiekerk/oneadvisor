export type Credentials = {
    userName: string;
    password: string;
};

export type Identity = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    organisationId: string;
    organisationName: string;
    branchId: string;
    branchName: string;
    roles: string[];
    useCaseIds: string[];
    scope: number;
};

export type TokenData = {
    exp: number;
};
