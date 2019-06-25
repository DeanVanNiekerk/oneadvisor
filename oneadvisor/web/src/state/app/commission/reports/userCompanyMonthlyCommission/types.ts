import { Filters } from '@/app/table';

export type UserCompanyMonthlyCommissionData = {
    companyId: string;
    amountExcludingVAT: number;
};

export type UserCompanyMonthlyCommissionFilters = Filters<{
    userId: string;
    companyId: string;
    startDate: string;
    endDate: string;
}>;
