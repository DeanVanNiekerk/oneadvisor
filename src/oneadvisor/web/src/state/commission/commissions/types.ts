import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation/types";

import { CommissionImportData } from "../errors";

export type Commission = {
    id: string;
    commissionStatementId: string;
    policyId: string;
    commissionTypeId: string;
    amountIncludingVAT: number;
    vat: number;
    userId: string;
    splitGroupId: string | null;
    policyNumber: string;

    commissionStatementDate: string;
    policyCompanyId: string;
    policyClientLastName: string;
    policyClientInitials: string;
    policyClientDateOfBirth: string | null;
};

export type CommissionEdit = {
    id: string | null;
    commissionStatementId: string;
    policyId: string;
    commissionTypeId: string;
    userId: string;
    amountIncludingVAT: number;
    vat: number;
    sourceData: CommissionImportData | null;
    splitGroupId: string | null;
};

export interface PagedCommissions extends PagedItems<Commission> {
    sumAmountIncludingVAT: number;
    sumVAT: number;
}

export type CommissionState = {
    readonly commission: CommissionEdit | null;
    readonly commissionOriginal: CommissionEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type ListState = {
    readonly items: Commission[];
    readonly totalItems: number;
    readonly sumAmountIncludingVAT: number;
    readonly sumVAT: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export type CommissionsState = {
    readonly list: ListState;
    readonly commission: CommissionState;
};
