import { Filters, PageOptions, SortOptions } from "@/app/table";

export type CommissionLapseData = {
    policyId: string;
    clientId: string;
    companyId: string;
    companyName: string;
    userId: string;
    number: string;
    startDate: string | null;
    premium: number | null;
    policyTypeId: string | null;
    isActive: boolean;
    clientLastName: string;
    clientInitials: string;
};

export type CommissionLapseDataFilters = Filters<{
    date: string;
    companyId: string;
    userId: string;
    policyTypeId: string;
}>;

export type CommissionLapseState = {
    readonly items: CommissionLapseData[];
    readonly fetching: boolean;
    readonly totalItems: number;
    readonly filters: CommissionLapseDataFilters | null;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
};
