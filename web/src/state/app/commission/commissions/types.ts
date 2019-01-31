export type Commission = {
    id: string;
    policyId: string;
    commissionTypeId: string;
    amountIncludingVAT: number;
    vat: number;
    userId: string;
};

export type CommissionEdit = {
    id: string;
    policyId: string;
    commissionTypeId: string;
    amountIncludingVAT: number;
    vat: number;
};
