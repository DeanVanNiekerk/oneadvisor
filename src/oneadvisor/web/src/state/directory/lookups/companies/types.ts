import { ValidationResult } from "@/app/validation";

export type Company = {
    id: string;
    name: string;
    commissionPolicyNumberPrefixes: string[];
};

export type CompanyEdit = {
    id: string | null;
    name: string;
    commissionPolicyNumberPrefixes: string[];
};

export type CompanyState = {
    readonly company: CompanyEdit | null;
    readonly companyOriginal: CompanyEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type CompanyListState = {
    readonly items: Company[];
    readonly fetching: boolean;
};

export type CompaniesState = {
    readonly list: CompanyListState;
    readonly company: CompanyState;
};
