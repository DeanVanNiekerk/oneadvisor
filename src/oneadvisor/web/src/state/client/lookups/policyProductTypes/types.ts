import { ValidationResult } from "@/app/validation";

export type PolicyProductType = {
    id: string;
    policyTypeId: string;
    name: string;
    code: string;
};

export type PolicyProductTypeEdit = {
    id: string | null;
    policyTypeId: string;
    name: string;
    code: string;
};

export type PolicyProductTypeListState = {
    readonly items: PolicyProductType[];
    readonly fetching: boolean;
};

export type PolicyProductTypeState = {
    readonly policyProductType: PolicyProductTypeEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type PolicyProductTypesState = {
    readonly list: PolicyProductTypeListState;
    readonly policyProductType: PolicyProductTypeState;
};
