export type Policy = {
    id: string;
    memberId: string;
    companyId: string;
    userId: string;
    number: string;
    userFullName: string;
    startDate: string;
    premium: number | null;
};

export type PolicyEdit = {
    id: string;
    memberId: string;
    companyId: string;
    userId: string;
    number: string;
    startDate: string;
    premium: number | null;
};
