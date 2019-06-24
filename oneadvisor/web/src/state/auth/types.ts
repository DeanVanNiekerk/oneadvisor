export type Credentials = {
    userName: string;
    password: string;
};

export type TokenData = {
    exp: number;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
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
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[];
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
