export type RoaInvestInputState = {
    readonly clientId: string | null;
    readonly consultReason: string;

    readonly productTypeIds: string[];
    readonly companyIds: string[];
    readonly funds: string[];

    readonly advisorRecommendation: string;
    readonly retirementPolicyRecurringPremium: number | null;
    readonly investmentRecurringPremium: number | null;
    readonly investmentLumpsum: number | null;
};
