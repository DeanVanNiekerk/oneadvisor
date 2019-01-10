export type ImportRow = string[];
export type ImportData = ImportRow[];

export type ImportColumn = {
    id: string;
    name: string;
};

export type ImportTableRow = { _id: string; [key: string]: string };

export type ImportMember = {
    _id: string;
    idNumber: string;
    lastName?: string | null;
    policyNumber?: string | null;
    policyCompanyId?: string | null;
};

export type ResultFailure = {
    _id: string;
    importMember: ImportMember;
    error: string;
};
