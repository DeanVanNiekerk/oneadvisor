export type Policy = {
    id: string;
    clientId: string;
    companyId: string;
    userId: string;
    number: string;
    userFullName: string;
    startDate: string;
    premium: number | null;
    policyTypeId: string | null;
    clientLastName: string;
    clientInitials: string;
    clientDateOfBirth: string | null;
};

export type PolicyEdit = {
    id: string;
    clientId: string;
    companyId: string;
    userId: string;
    number: string;
    startDate: string;
    premium: number | null;
    policyTypeId: string | null;
};
