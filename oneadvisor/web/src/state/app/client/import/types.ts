export type ImportRow = string[];
export type ImportData = ImportRow[];

export type ImportColumn = {
    id: keyof ImportClient;
    name: string;
};

export type ImportTableRow = { _id: string; [key: string]: string };

export type ImportClient = {
    _id: string;
    idNumber: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    cellphone?: string | null;
    taxNumber?: string | null;
    dateOfBirth?: string | null;
    policyNumber?: string | null;
    policyCompanyId?: string | null;
    policyUserFullName?: string | null;
    policyPremium?: number | null;
    policyType?: string | null;
    policyStartDate?: string | null;
};

export type ResultFailure = {
    _id: string;
    importClient: ImportClient;
    error: string;
};
