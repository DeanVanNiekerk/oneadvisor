export type Credentials = {
    userName: string;
    password: string;
    organisationId: string | null;
};

export type TokenData = {
    exp: number;
    nameid: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    organisationId: string;
    organisationName: string;
    branchId: string;
    branchName: string;
    useCaseIds: string[];
    scope: number;
    roles: string[];
};

export type ResetPasswordData = {
    userName: string;
    password: string;
    confirmPassword: string;
    token: string;
};

export type ResetPasswordRequestData = {
    userName: string;
};
