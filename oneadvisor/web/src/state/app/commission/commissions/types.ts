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
    splitGroupId: string | null;
    policyNumber: string;

    commissionStatementDate: string;
    policyCompanyId: string;
    policyClientLastName: string;
    policyClientInitials: string;
    policyClientDateOfBirth: string | null;
};

export type CommissionEdit = {
    id: string;
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
