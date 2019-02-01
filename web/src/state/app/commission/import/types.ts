export type ImportRow = string[];
export type ImportData = ImportRow[];

export type ImportColumn = {
    id: string;
    name: string;
};

export type ImportTableRow = { _id: string; [key: string]: string };

export type ImportCommission = {
    _id: string;
    policyNumber?: string;
    amountIncludingVAT?: number;
    vat?: number;
    commissionTypeCode?: string;
    date?: string;
};

export type ResultFailure = {
    _id: string;
    importCommission: ImportCommission;
    error: string;
};
