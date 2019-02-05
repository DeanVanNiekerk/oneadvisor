import { PagedItems } from '@/app/table';

export type Statement = {
    id: string;
    companyId: string;
    date: string;
    amountIncludingVAT: number;
    vat: number;
    processed: boolean;

    formatErrorCount: number;
    mappingErrorCount: number;

    actualAmountIncludingVAT: number;
    actualVAT: number;
};

export type StatementEdit = {
    id: string;
    companyId: string;
    date: string;
    amountIncludingVAT: number;
    vat: number;
    processed: boolean;
};

export interface PagedStatements extends PagedItems<Statement> {
    sumAmountIncludingVAT: number;
    sumVAT: number;
    averageAmountIncludingVAT: number;
    averageVAT: number;
}