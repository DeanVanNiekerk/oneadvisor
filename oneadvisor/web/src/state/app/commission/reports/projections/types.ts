import { Filters } from "@/app/table";

export type PastRevenueCommissionData = {
    companyId: string;
    policyTypeId: string | null;
    commissionEarningsTypeId: string;
    dateYear: number;
    dateMonth: number;
    amountExcludingVAT: number;
};

export type PastRevenueCommissionDataFilters = Filters<{
    branchId: string;
    companyId: string;
    policyTypeId: string;
    commissionEarningsTypeId: string;
    startDate: string;
    endDate: string;
    userId: string;
}>;
