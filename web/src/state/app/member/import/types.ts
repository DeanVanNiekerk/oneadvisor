export type ImportRow = string[];
export type ImportData = ImportRow[];

export type ImportColumn = {
    id: string;
    name: string;
};

export type ImportTableRow = { [key: string]: string };

export type ImportMember = {
    _id: string;
    idNumber: string;
    lastName?: string | null;
    policyNumber?: string | null;
};
