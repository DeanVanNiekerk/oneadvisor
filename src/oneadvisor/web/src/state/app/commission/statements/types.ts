import { PagedItems } from "@/app/table";

export type Statement = {
    id: string;
    companyId: string;
    date: string;
    amountIncludingVAT: number;
    vat: number;
    processed: boolean;

    mappingErrorCount: number;
    commissionCount: number;

    actualAmountIncludingVAT: number;
    actualVAT: number;

    companyName: string;
};

export type StatementEdit = {
    id: string | null;
    companyId: string;
    date: string;
    amountIncludingVAT: number;
    vat: number;
    processed: boolean;
};

export interface PagedStatements extends PagedItems<Statement> {
    sumAmountIncludingVAT: number;
    sumVAT: number;
}
