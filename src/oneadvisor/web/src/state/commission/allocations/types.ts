import { ValidationResult } from "@/app/validation";

export type Allocation = {
    id: string;
    fromClientId: string;
    toClientId: string;
    policyIdCount: number;
    fromClientFirstName: string;
    fromClientLastName: string;
};

export type AllocationEdit = {
    id: string | null;
    fromClientId: string | null;
    toClientId: string;
    policyIds: string[];
};

export type AllocationState = {
    readonly allocation: AllocationEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type ListState = {
    readonly totalItems: number;
    readonly items: Allocation[];
    readonly fetching: boolean;
};

export type AllocationsState = {
    readonly list: ListState;
    readonly allocation: AllocationState;
};
