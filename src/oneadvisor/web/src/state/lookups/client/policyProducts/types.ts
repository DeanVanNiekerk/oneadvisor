import { ValidationResult } from "@/app/validation/types";

export type PolicyProduct = {
    id: string;
    policyProductTypeId: string;
    companyId: string;
    name: string;
    code: string;
};

export type PolicyProductEdit = {
    id: string | null;
    policyProductTypeId: string;
    companyId: string;
    name: string;
    code: string;
};

export type PolicyProductListState = {
    readonly items: PolicyProduct[];
    readonly fetching: boolean;
};

export type PolicyProductState = {
    readonly policyProduct: PolicyProductEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type PolicyProductsState = {
    readonly list: PolicyProductListState;
    readonly policyProduct: PolicyProductState;
};
