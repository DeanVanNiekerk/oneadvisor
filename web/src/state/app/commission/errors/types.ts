export type CommissionError = {
    id: string;
    commissionStatementId: string;
    policyId: string | null;
    memberId: string | null;
    commissionTypeId: string | null;
    data: string;
    isFormatValid: boolean;
};
