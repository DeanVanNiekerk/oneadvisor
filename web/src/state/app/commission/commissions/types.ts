import { PagedItems } from '@/app/table';

import { CommissionImportData } from '../errors';

export type Commission = {
    id: string;
    commissionStatementId: string;
    policyId: string;
    commissionTypeId: string;
    amountIncludingVAT: number;
    vat: number;
    userId: string;
    policyNumber: string;
};

export type CommissionEdit = {
    id: string;
    commissionStatementId: string;
    policyId: string;
    commissionTypeId: string;
    amountIncludingVAT: number;
    vat: number;
    sourceData: CommissionImportData;
};

export interface PagedCommissions extends PagedItems<Commission> {
    sumAmountIncludingVAT: number;
    sumVAT: number;
    averageAmountIncludingVAT: number;
    averageVAT: number;
}
