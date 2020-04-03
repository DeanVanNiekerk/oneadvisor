import { ValidationResult } from "@/app/validation";

export const UNKNOWN_COMMISSION_TYPE_CODE = "unknown";

export type CommissionType = {
    id: string;
    policyTypeId: string;
    commissionEarningsTypeId: string;
    name: string;
    code: string;
};

export type CommissionTypeEdit = {
    id: string | null;
    policyTypeId: string;
    commissionEarningsTypeId: string;
    name: string;
    code: string;
};

export type CommissionTypeState = {
    readonly commissionType: CommissionTypeEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type CommissionTypeListState = {
    readonly items: CommissionType[];
    readonly fetching: boolean;
};

export type CommissionTypesState = {
    readonly list: CommissionTypeListState;
    readonly commissionType: CommissionTypeState;
};
