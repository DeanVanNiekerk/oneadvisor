import { Filters } from "@/app/table";

export type UserEarningsTypeMonthlyCommissionData = {
    commissionEarningsTypeId: string;
    amountExcludingVAT: number;
};

export type UserEarningsTypeMonthlyCommissionFilters = Filters<{
    userId: string;
    companyId: string;
    startDate: string;
    endDate: string;
}>;

export type UserEarningsTypeMonthlyCommissionState = {
    readonly items: UserEarningsTypeMonthlyCommissionData[];
    readonly fetching: boolean;
    readonly filters: UserEarningsTypeMonthlyCommissionFilters;
};
