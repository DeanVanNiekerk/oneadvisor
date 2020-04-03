import { Filters, PageOptions, SortOptions } from "@/app/table";

export type ClientRevenueData = {
    rowNumber: number;
    clientId: string;
    clientLastName: string;
    clientInitials: string;
    clientDateOfBirth: string;

    monthlyAnnuityMonth: number;
    annualAnnuityAverage: number;
    totalMonthlyEarnings: number;
    lifeFirstYears: number;
    onceOff: number;
    grandTotal: number;

    allocationsCount: number;
};

export type ClientRevenueDataFilters = Filters<{
    yearEnding;
    monthEnding;
    clientLastName;
    branchId;
    userId;
    policyTypeId;
}>;

export type ClientRevenueState = {
    readonly items: ClientRevenueData[];
    readonly fetching: boolean;
    readonly itemsPaged: ClientRevenueData[];
    readonly totalItems: number;
    readonly fetchingPaged: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: ClientRevenueDataFilters | null;
};
