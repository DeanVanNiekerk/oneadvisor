import { Investment, RoaInvestInputState } from "./types";

type RoaInvestInputClientIdReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE";
    payload: string | null;
};

type RoaInvestInputConsultReasonReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE";
    payload: string;
};

type RoaInvestInputInvestmentAdviceTypeCodeReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENTADVICETYPECODE_RECEIVE";
    payload: string;
};

type RoaInvestInputNeedMonthlyReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_NEEDMONTHLY_RECEIVE";
    payload: number | null;
};

type RoaInvestInputNeedLumpsumReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_NEEDLUMPSUM_RECEIVE";
    payload: number | null;
};

type RoaInvestInputContributionMonthlyReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONMONTHLY_RECEIVE";
    payload: number | null;
};

type RoaInvestInputContributionLumpsumReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONLUMPSUM_RECEIVE";
    payload: number | null;
};

type RoaInvestInputDiscussedProductTypeIdsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDPRODUCTTYPEIDS_RECEIVE";
    payload: string[];
};

type RoaInvestInputDiscussedCompanyIdsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDCOMPANYIDS_RECEIVE";
    payload: string[];
};

type RoaInvestInputDiscussedFundsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDFUNDCODES_RECEIVE";
    payload: string[];
};

type RoaInvestInputRecommendedProductTypeIdsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDPRODUCTTYPEIDS_RECEIVE";
    payload: string[];
};

type RoaInvestInputRecommendedCompanyIdsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDCOMPANYIDS_RECEIVE";
    payload: string[];
};

type RoaInvestInputRecommendedFundsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDFUNDCODES_RECEIVE";
    payload: string[];
};

type RoaInvestInputRecommendedActionReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDACTION_RECEIVE";
    payload: string;
};

type RoaInvestInputClientChoiceReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTCHOICE_RECEIVE";
    payload: string;
};

type RoaInvestInputInvestmentReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_RECEIVE";
    payload: Investment;
};

type RoaInvestInputAddInvestmentAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_ADD";
};

type RoaInvestInputRemoveInvestmentAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_REMOVE";
    payload: string;
};

type RoaInvestInputStateReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_STATE_RECEIVE";
    payload: RoaInvestInputState;
};

export type RoaInvestInputAction =
    | RoaInvestInputClientIdReceiveAction
    | RoaInvestInputConsultReasonReceiveAction
    | RoaInvestInputInvestmentAdviceTypeCodeReceiveAction
    | RoaInvestInputNeedMonthlyReceiveAction
    | RoaInvestInputNeedLumpsumReceiveAction
    | RoaInvestInputContributionMonthlyReceiveAction
    | RoaInvestInputContributionLumpsumReceiveAction
    | RoaInvestInputDiscussedProductTypeIdsReceiveAction
    | RoaInvestInputDiscussedCompanyIdsReceiveAction
    | RoaInvestInputDiscussedFundsReceiveAction
    | RoaInvestInputRecommendedProductTypeIdsReceiveAction
    | RoaInvestInputRecommendedCompanyIdsReceiveAction
    | RoaInvestInputRecommendedFundsReceiveAction
    | RoaInvestInputRecommendedActionReceiveAction
    | RoaInvestInputClientChoiceReceiveAction
    | RoaInvestInputInvestmentReceiveAction
    | RoaInvestInputAddInvestmentAction
    | RoaInvestInputRemoveInvestmentAction
    | RoaInvestInputStateReceiveAction;

export const receiveClientId = (clientId: string | null): RoaInvestInputClientIdReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE",
    payload: clientId,
});

export const receiveConsultReason = (reason: string): RoaInvestInputConsultReasonReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE",
    payload: reason,
});

export const receiveInvestmentAdviceTypeCode = (
    adviceTypeCode: string
): RoaInvestInputInvestmentAdviceTypeCodeReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENTADVICETYPECODE_RECEIVE",
    payload: adviceTypeCode,
});

export const receiveNeedMonthly = (
    needMonthly: number | null
): RoaInvestInputNeedMonthlyReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_NEEDMONTHLY_RECEIVE",
    payload: needMonthly,
});

export const receiveNeedLumpsum = (
    needLumpsum: number | null
): RoaInvestInputNeedLumpsumReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_NEEDLUMPSUM_RECEIVE",
    payload: needLumpsum,
});

export const receiveContributionMonthly = (
    contributionMonthly: number | null
): RoaInvestInputContributionMonthlyReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONMONTHLY_RECEIVE",
    payload: contributionMonthly,
});

export const receiveContributionLumpsum = (
    contributionLumpsum: number | null
): RoaInvestInputContributionLumpsumReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONLUMPSUM_RECEIVE",
    payload: contributionLumpsum,
});

export const receiveDiscussedProductTypeIds = (
    discussedProductTypeIds: string[]
): RoaInvestInputDiscussedProductTypeIdsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDPRODUCTTYPEIDS_RECEIVE",
    payload: discussedProductTypeIds,
});

export const receiveDiscussedCompanyIds = (
    discussedCompanyIds: string[]
): RoaInvestInputDiscussedCompanyIdsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDCOMPANYIDS_RECEIVE",
    payload: discussedCompanyIds,
});

export const receiveDiscussedFundCodes = (
    discussedFundCodes: string[]
): RoaInvestInputDiscussedFundsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDFUNDCODES_RECEIVE",
    payload: discussedFundCodes,
});

export const receiveRecommendedProductTypeIds = (
    recommendedProductTypeIds: string[]
): RoaInvestInputRecommendedProductTypeIdsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDPRODUCTTYPEIDS_RECEIVE",
    payload: recommendedProductTypeIds,
});

export const receiveRecommendedCompanyIds = (
    recommendedCompanyIds: string[]
): RoaInvestInputRecommendedCompanyIdsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDCOMPANYIDS_RECEIVE",
    payload: recommendedCompanyIds,
});

export const receiveRecommendedFundCodes = (
    recommendedFundCodes: string[]
): RoaInvestInputRecommendedFundsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDFUNDCODES_RECEIVE",
    payload: recommendedFundCodes,
});

export const receiveRecommendedAction = (
    recommendedAction: string
): RoaInvestInputRecommendedActionReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDACTION_RECEIVE",
    payload: recommendedAction,
});

export const receiveClientChoice = (
    clientChoice: string
): RoaInvestInputClientChoiceReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTCHOICE_RECEIVE",
    payload: clientChoice,
});

export const receiveInvestment = (
    investment: Investment
): RoaInvestInputInvestmentReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_RECEIVE",
    payload: investment,
});

export const addInvestment = (): RoaInvestInputAddInvestmentAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_ADD",
});

export const removeInvestment = (id: string): RoaInvestInputRemoveInvestmentAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_REMOVE",
    payload: id,
});

export const receiveRoaInvestInputState = (
    state: RoaInvestInputState
): RoaInvestInputStateReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_STATE_RECEIVE",
    payload: state,
});
