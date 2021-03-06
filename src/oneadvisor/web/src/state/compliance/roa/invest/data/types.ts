import { RiskProfileCode } from "../risk/types";

export type RoaInvestDataState = {
    readonly fetching: boolean;
    readonly data: RoaInvestData;
};

export type RoaInvestData = {
    readonly userFullName: string;
    readonly clientFullName: string;
    readonly clientIdNumber: string;
    readonly clientAge: string;
    readonly clientYearsToRetirement: string;
    readonly userOrganisationName: string;
    readonly logoDataUrl: string;

    //Needs
    readonly consultReason: string;
    readonly investmentAdviceType: string;
    readonly needMonthly: string;
    readonly needLumpsum: string;
    readonly contributionMonthly: string;
    readonly contributionLumpsum: string;
    readonly retirementAge: string;
    readonly lifeExpectancy: string;
    readonly rateOfReturn: string;

    //Discussed
    readonly discussedProductTypes: string[];
    readonly discussedCompanies: string[];
    readonly discussedFunds: string[];

    //Recommended
    readonly recommendedProductTypes: string[];
    readonly recommendedCompanies: string[];
    readonly recommendedFunds: string[];
    readonly recommendedAction: string;

    //Client Choice
    readonly clientChoice: string;

    //Investments
    readonly investments: InvestmentData[];

    //Risk
    readonly riskProfileCode: RiskProfileCode;
    readonly riskProfileName: string;
    readonly riskScore: number | null;
    readonly riskQuestions: RiskQuestion[];
};

export type InvestmentData = {
    readonly number: string;

    readonly companyName: string;
    readonly productTypeName: string;
    readonly funds: string[];

    readonly contributionPremium: string;
    readonly contributionLumpsum: string;

    readonly upfrontFee: string;

    readonly assetManagementFee: string;

    readonly productCharacteristics: ProductTypeCharacteristics[];
};

export type ProductTypeCharacteristics = {
    readonly name: string;
    readonly description: string;
};

export type RiskQuestion = {
    text: string;
    answers: RiskAnswer[];
};

export type RiskAnswer = {
    text: string;
    isSelected: boolean;
};
