import { PagedItems } from '@/app/table';

export type Commission = {
    id: string;
    commissionStatementId: string;
    policyId: string;
    commissionTypeId: string;
    amountIncludingVAT: number;
    vat: number;
    userId: string;
};

export type CommissionEdit = {
    id: string;
    commissionStatementId: string;
    policyId: string;
    commissionTypeId: string;
    amountIncludingVAT: number;
    vat: number;
};

export interface PagedCommissions extends PagedItems<Commission> {
    sumAmountIncludingVAT: number;
    sumVAT: number;
    averageAmountIncludingVAT: number;
    averageVAT: number;
}
