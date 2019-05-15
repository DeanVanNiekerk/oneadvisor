export type UserCompanyMonthlyCommissionData = {
    userId: string;
    userLastName: string;
    userFirstName: string;

    month: number;
    year: number;

    companyId: string;
    amountExcludingVAT: number;
};
