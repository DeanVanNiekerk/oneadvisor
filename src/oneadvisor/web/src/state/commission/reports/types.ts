import {
    ClientRevenueState,
    CommissionLapseState,
    ProjectionsState,
    UserCompanyMonthlyCommissionState,
    UserEarningsTypeMonthlyCommissionState,
    UserMonthlyCommissionState,
} from "./";

export type ReportsState = {
    clientRevenue: ClientRevenueState;
    userEarningsTypeMonthlyCommission: UserEarningsTypeMonthlyCommissionState;
    userCompanyMonthlyCommission: UserCompanyMonthlyCommissionState;
    userMonthlyCommission: UserMonthlyCommissionState;
    projections: ProjectionsState;
    commissionLapse: CommissionLapseState;
};
