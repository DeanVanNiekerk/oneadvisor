import { Filters, PageOptions, SortOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation";

export type CommissionErrorEdit = {
    id: string;
    commissionStatementId: string;
    policyId: string | null;
    clientId: string | null;
    commissionTypeId: string | null;
    data: CommissionImportData;
};

export type CommissionError = {
    id: string;
    commissionStatementId: string;
    commissionStatementYear: number;
    commissionStatementMonth: number;
    policyId: string | null;
    clientId: string | null;
    commissionTypeId: string | null;
    data: CommissionImportData;
    policyTypeCode: string | null;
    companyName: string;
    companyId: string;
};

export type CommissionImportData = {
    policyNumber: string;
    commissionTypeCode: string;
    amountIncludingVAT: string;
    vat: string;

    firstName?: string | null;
    lastName?: string | null;
    initials?: string | null;
    dateOfBirth?: string | null;
    idNumber?: string | null;
    fullName?: string | null;
    brokerFullName?: string | null;
};

export type CommissionErrorsFilters = Filters<
    Pick<
        CommissionError,
        "commissionStatementId" | "commissionStatementYear" | "commissionStatementMonth"
    >
>;

export type ListState = {
    readonly items: CommissionError[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export type MappingState = {
    readonly commissionError: CommissionErrorEdit | null;
    readonly commissionErrorOriginal: CommissionErrorEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type ErrorsState = {
    readonly mapping: MappingState;
    readonly list: ListState;
};
