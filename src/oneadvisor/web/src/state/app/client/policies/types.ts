export type Policy = {
    id: string;
    clientId: string;
    companyId: string;
    companyName: string;
    userId: string;
    number: string;
    userFullName: string;
    startDate: string;
    premium: number | null;
    policyTypeId: string | null;
    policyProductTypeId: string | null;
    policyProductId: string | null;
    clientLastName: string;
    clientInitials: string;
    clientDateOfBirth: string | null;
    isActive: boolean;
    numberAliases: string[];
};

export type PolicyEdit = {
    id: string | null;
    clientId: string | null;
    companyId: string | null;
    userId: string | null;
    number: string;
    startDate: string | null;
    premium: number | null;
    policyTypeId: string | null;
    policyProductTypeId: string | null;
    policyProductId: string | null;
    isActive: boolean;
    numberAliases: string[];
};
