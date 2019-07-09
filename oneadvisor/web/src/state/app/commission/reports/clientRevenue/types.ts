import { Filters } from '@/app/table';

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
