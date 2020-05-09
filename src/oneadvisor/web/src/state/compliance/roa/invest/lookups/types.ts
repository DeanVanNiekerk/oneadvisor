import { RiskProfileCaptureMode } from "../risk/types";

export type InvestmentAdviceType = {
    code: string;
    name: string;
};

export type RateOfReturn = {
    code: string;
    name: string;
};

export type CaptureMode = {
    code: RiskProfileCaptureMode;
    name: string;
};

export type RoaInvestLookupsState = {
    readonly investmentAdviceTypes: InvestmentAdviceType[];
    readonly rateOfReturns: RateOfReturn[];
    readonly riskProfileCaptureModes: CaptureMode[];
};
