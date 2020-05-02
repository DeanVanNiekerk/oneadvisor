import { ValidationResult } from "@/app/validation/types";

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
    useCaseIds: string[] | string;
    scope: number;
    roles: string[] | string;
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

export type ResetPasswordState = {
    readonly fetching: boolean;
    readonly validationResults: ValidationResult[];
};

export type SignInState = {
    readonly fetching: boolean;
    readonly validationResults: ValidationResult[];
    readonly signInFailed: boolean;
};

export type TokenState = {
    readonly token: string | null;
    readonly tokenData: TokenData | null;
};

export type AuthState = {
    readonly resetPassword: ResetPasswordState;
    readonly signIn: SignInState;
    readonly token: TokenState;
};
