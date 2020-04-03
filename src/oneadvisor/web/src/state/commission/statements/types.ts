import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation";
import { FileInfo } from "@/state/types";

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

export type FilesState = {
    readonly items: FileInfo[];
    readonly fetching: boolean;
};

export type ListState = {
    readonly items: Statement[];
    readonly totalItems: number;
    readonly sumAmountIncludingVAT: number;
    readonly sumVAT: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filterMonth: number;
    readonly filterYear: number;
    readonly filters: Filters | null;
};

export type PreviewState = {
    readonly statement: Statement | null;
    readonly fetching: boolean;
};

export type StatementState = {
    readonly statement: StatementEdit | null;
    readonly statementOriginal: StatementEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type StatementsState = {
    readonly list: ListState;
    readonly statement: StatementState;
    readonly preview: PreviewState;
    readonly files: FilesState;
};
