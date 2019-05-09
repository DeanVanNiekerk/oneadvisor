export type UserEarningsTypeMonthlyCommissionData = {
    userId: string;
    userLastName: string;
    userFirstName: string;

    month: number;
    year: number;

    commissionEarningsTypeId: string;
    amountExcludingVAT: number;
};
