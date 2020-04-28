export type RoaInvestDataState = {
    readonly fetching: boolean;
    readonly data: RoaInvestData;
};

export type RoaInvestData = {
    //Needs
    readonly clientFullName: string;
    readonly consultReason: string;
    readonly investmentAdviceType: string;
    readonly needMonthly: string;
    readonly needLumpsum: string;
    readonly contributionMonthly: string;
    readonly contributionLumpsum: string;

    //Discussed
    readonly discussedProductTypes: string[];
    readonly discussedCompanies: string[];
    readonly discussedFunds: string[];

    //Recommended
    readonly recommendedProductTypes: string[];
    readonly recommendedCompanyies: string[];
    readonly recommendedFunds: string[];
    readonly recommendedAction: string;

    //Client Choice
    readonly clientChoice: string;
};
