export type RoaInvestDataState = {
    readonly fetching: boolean;
    readonly data: RoaInvestData;
};

export type RoaInvestData = {
    readonly clientFullName: string;
    readonly consultReason: string;

    readonly companyNames: string[];
    readonly productTypeNames: string[];
    readonly funds: string[];

    readonly advisorRecommendation: string;
    readonly retirementPolicyRecurringPremium: number | null;
    readonly investmentRecurringPremium: number | null;
    readonly investmentLumpsum: number | null;
};
