export type RoaInvestInputState = {
    //Needs
    readonly clientId: string | null;
    readonly consultReason: string;
    readonly investmentAdviceType: string;
    readonly needMonthly: number | null;
    readonly needLumpsum: number | null;
    readonly contributionMonthly: number | null;
    readonly contributionLumpsum: number | null;

    //Discussed
    readonly discussedProductTypeIds: string[];
    readonly discussedCompanyIds: string[];
    readonly discussedFunds: string[];

    //Recommended
    readonly recommendedProductTypeIds: string[];
    readonly recommendedCompanyIds: string[];
    readonly recommendedFunds: string[];
    readonly recommendedAction: string;

    //Client Choice
    readonly clientChoice: string;
};
