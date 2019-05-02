export type UserMonthlyCommissionData = {
    userId: string;
    userLastName: string;
    userFirstName: string;

    month: number;
    year: number;

    commissionEarningsTypeId: string;
    amountIncludingVAT: number;
};
