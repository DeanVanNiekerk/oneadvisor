import { ValidationResult } from "@/app/validation/types";

export type LicenseCategory = {
    id: string;
    code: string;
    name: string;
};

export type LicenseCategoryEdit = {
    id: string | null;
    code: string;
    name: string;
};

export type LicenseCategoryState = {
    readonly licenseCategory: LicenseCategoryEdit | null;
    readonly licenseCategoryOriginal: LicenseCategoryEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type LicenseCategoryListState = {
    readonly items: LicenseCategory[];
    readonly fetching: boolean;
};

export type LicenseCategoriesState = {
    readonly list: LicenseCategoryListState;
    readonly licenseCategory: LicenseCategoryState;
};
