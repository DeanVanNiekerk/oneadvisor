import { Filters } from "@/app/table";

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
    Pick<CommissionError, "commissionStatementId" | "commissionStatementYear" | "commissionStatementMonth">
>;
