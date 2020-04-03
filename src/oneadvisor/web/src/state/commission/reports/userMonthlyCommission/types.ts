export type UserMonthlyCommissionType = "Month" | "YearToDate" | "Last12Months";

export type UserMonthlyCommissionTypeOption = { key: UserMonthlyCommissionType; label: string };

export type UserMonthlyCommissionState = {
    readonly year: number;
    readonly month: number;
    readonly type: UserMonthlyCommissionType;
    readonly typeOptions: UserMonthlyCommissionTypeOption[];
};
