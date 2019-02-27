export type CommissionError = {
    id: string;
    commissionStatementId: string;
    policyId: string | null;
    memberId: string | null;
    commissionTypeId: string | null;
    data: CommissionImportData;
    isFormatValid: boolean;
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
