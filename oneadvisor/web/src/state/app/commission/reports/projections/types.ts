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

export type GroupTableRecordBase = {
    key: string;
    sortKey: string;
    earningsTypeGroupKey: string;
    policyTypeRowSpan: number;
    earningsTypeRowSpan: number;
    policyTypeColSpan: number;
    earningsTypeColSpan: number;
    policyTypeId?: string | null;
    commissionEarningsTypeId?: string;
    companyId?: string;
    isTotalRow?: boolean;
};

type GroupTableRecordExtension = {
    [key: string]: string | number | boolean;
};

export type GroupTableRecord = GroupTableRecordBase & GroupTableRecordExtension;

export type Group = "Policy Type" | "Earnings Type" | "Company";
