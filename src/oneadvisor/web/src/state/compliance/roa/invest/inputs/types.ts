export type RoaInvestInputState = {
    //Client Choice
    readonly clientChoice: string;
    //Investments
    readonly investments: Investment[];
} & RoaInvestInputNeedsState &
    RoaInvestInputDiscussedState &
    RoaInvestInputRecommendedState;

export type RoaInvestInputNeedsState = {
    //Needs
    readonly clientId: string | null;
    readonly consultReason: string;
    readonly investmentAdviceTypeCode: string;
    readonly needMonthly: number | null;
    readonly needLumpsum: number | null;
    readonly contributionMonthly: number | null;
    readonly contributionLumpsum: number | null;
};

export type RoaInvestInputDiscussedState = {
    //Discussed
    readonly discussedProductTypeIds: string[];
    readonly discussedCompanyIds: string[];
    readonly discussedFundCodes: string[];
};

export type RoaInvestInputRecommendedState = {
    //Recommended
    readonly recommendedProductTypeIds: string[];
    readonly recommendedCompanyIds: string[];
    readonly recommendedFundCodes: string[];
    readonly recommendedAction: string;
};

export type Investment = {
    readonly id: string;

    readonly companyId: string;
    readonly productTypeId: string;
    readonly fundCodes: string[];

    readonly contributionPremium: number | null;
    readonly contributionLumpsum: number | null;

    readonly upfrontFeePercent: number | null;
    readonly upfrontFeeAmount: number | null;

    readonly assetManagementFeePercent: number | null;
};
