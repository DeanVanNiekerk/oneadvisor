export type InvestmentAdviceType = {
    code: string;
    name: string;
};

export type RoaInvestLookupsState = {
    readonly investmentAdviceTypes: InvestmentAdviceType[];
};
