import { Filters } from "@/app/table";

export type UserCompanyMonthlyCommissionData = {
    companyId: string;
    amountExcludingVAT: number;
};

export type UserCompanyMonthlyCommissionFilters = Filters<{
    userId: string;
    companyId: string;
    branchId: string;
    startDate: string;
    endDate: string;
}>;

export type UserCompanyMonthlyCommissionState = {
    readonly items: UserCompanyMonthlyCommissionData[];
    readonly fetching: boolean;
    readonly filters: UserCompanyMonthlyCommissionFilters | null;
};
