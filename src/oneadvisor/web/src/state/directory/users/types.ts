import { PageOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation";

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
    emailConfirmed: boolean;
    lockoutEnd: string | null;
    isLocked: boolean;
    userTypeId: string;
    config: Config;
};

export type UserEdit = {
    id: string | null;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    branchId: string;
    roles: string[];
    scope: number;
    aliases: string[];
    isLocked: boolean;
    userTypeId: string;
    config: Config;
};

export type Config = {
    adviceScopeIds: string[];
    licenseCategoryIds: string[];
};

export type ListState = {
    readonly totalItems: number;
    readonly items: User[];
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
};

export type UserState = {
    readonly user: UserEdit | null;
    readonly userOriginal: UserEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type UsersState = {
    readonly list: ListState;
    readonly user: UserState;
};
