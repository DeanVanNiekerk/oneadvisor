export type CommissionError = {
    id: string;
    commissionStatementId: string;
    policyId: string | null;
    memberId: string | null;
    commissionTypeId: string | null;
    data: string;
    isFormatValid: boolean;
};

export type CommissionErrorData = {
    PolicyNumber: string;
    CommissionTypeCode: string;
    AmountIncludingVAT: string;
    VAT: string;

    FirstName: string;
    LastName: string;
    Initials: string;
    DateOfBirth: string;
    IdNumber: string;
};
