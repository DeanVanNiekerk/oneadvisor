export type Credentials = {
    userName: string;
    password: string;
};

export type TokenData = {
    exp: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    organisationId: string;
    organisationName: string;
    branchId: string;
    branchName: string;
    useCaseIds: string[];
    scope: number;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[];
};

export type ResetPassword = {
    userName: string;
    password: string;
    confirmPassword: string;
    token: string;
};
