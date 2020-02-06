export type Company = {
    id: string;
    name: string;
    commissionPolicyNumberPrefixes: string[];
};

export type CompanyEdit = {
    id: string | null;
    name: string;
    commissionPolicyNumberPrefixes: string[];
};
