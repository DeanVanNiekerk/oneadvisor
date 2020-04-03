import { ValidationResult } from "@/app/validation";

export type Role = {
    id: string;
    name: string;
    description: string;
    applicationId: string;
};

export type RoleEdit = {
    id: string | null;
    name: string;
    description: string;
    applicationId: string;
    useCaseIds: string[];
};

export type ListState = {
    readonly items: Role[];
    readonly fetching: boolean;
};

export type RoleState = {
    readonly role: RoleEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type RolesState = {
    readonly list: ListState;
    readonly role: RoleState;
};
