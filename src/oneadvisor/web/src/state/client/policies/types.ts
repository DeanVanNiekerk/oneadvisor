import { Filters, PageOptions, SortOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation/types";

export type Policy = {
    id: string;
    clientId: string;
    companyId: string;
    companyName: string;
    userId: string;
    number: string;
    startDate: string;
    premium: number | null;
    policyTypeId: string | null;
    policyProductTypeId: string | null;
    policyProductId: string | null;
    clientLastName: string;
    clientInitials: string;
    clientDateOfBirth: string | null;
    isActive: boolean;
    numberAliases: string[];
};

export type PolicyEdit = {
    id: string | null;
    clientId: string | null;
    companyId: string | null;
    userId: string | null;
    number: string;
    startDate: string | null;
    premium: number | null;
    policyTypeId: string | null;
    policyProductTypeId: string | null;
    policyProductId: string | null;
    isActive: boolean;
    numberAliases: string[];
};

export type MergePolicies = {
    targetPolicy: PolicyEdit;
    sourcePolicyIds: string[];
};

export type ListState = {
    readonly items: Policy[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
    readonly selectedPolicies: Policy[];
};

export type PolicyState = {
    readonly policy: PolicyEdit | null;
    readonly policyOriginal: PolicyEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type SearchState = {
    readonly items: Policy[];
    readonly fetching: boolean;
};

export type PoliciesState = {
    readonly list: ListState;
    readonly search: SearchState;
    readonly policy: PolicyState;
    readonly merge: MergeState;
};

export type MergeState = {
    readonly visible: boolean;
    readonly fetching: boolean;
};
