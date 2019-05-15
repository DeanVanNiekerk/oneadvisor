export type CommissionErrorEdit = {
    id: string;
    commissionStatementId: string;
    policyId: string | null;
    clientId: string | null;
    commissionTypeId: string | null;
    data: CommissionImportData;
    isFormatValid: boolean;
};

export type CommissionError = {
    id: string;
    commissionStatementId: string;
    policyId: string | null;
    clientId: string | null;
    commissionTypeId: string | null;
    data: CommissionImportData;
    isFormatValid: boolean;
    policyTypeCode: string | null;
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
