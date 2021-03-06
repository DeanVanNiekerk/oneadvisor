export const UNKNOWN_COMMISSION_EARNINGS_TYPE_ID = "27ec936b-5db7-64b8-1a1b-5edb3b56a20d";
export const MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID = "8b42edc0-fac6-e946-c779-9d90a805c294";
export const ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID = "e8799015-6f4a-5d45-5be9-0fcd516e0951";
export const LIFE_FIRST_YEARS_COMMISSION_EARNINGS_TYPE_ID = "e7f98561-f018-3edd-2118-e3646c89e2a2";
export const ONCE_OFF_COMMISSION_EARNINGS_TYPE_ID = "9f8fc29d-0f1c-b952-d446-79cc3ed967d7";

export type CommissionEarningsType = {
    id: string;
    name: string;
};

export type CommissionEarningsTypeListState = {
    readonly items: CommissionEarningsType[];
};

export type CommissionEarningsTypesState = {
    readonly list: CommissionEarningsTypeListState;
};
