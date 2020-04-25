type RoaInvestInputClientIdReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE";
    payload: string | null;
};

type RoaInvestInputConsultReasonReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE";
    payload: string;
};

type RoaInvestInputProductTypeIdsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_PRODUCTTYPEIDS_RECEIVE";
    payload: string[];
};

type RoaInvestInputCompanyIdsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_COMPANYIDS_RECEIVE";
    payload: string[];
};

type RoaInvestInputFundsReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_FUNDS_RECEIVE";
    payload: string[];
};

type RoaInvestInputAdvisorRecommendationReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_ADVISOR_RECOMMENDATION_RECEIVE";
    payload: string;
};

type RoaInvestInputInvestmentLumpsumReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVEST_LUMPSUM_RECEIVE";
    payload: number | null;
};

type RoaInvestInputInvestmentRecurringPremiumReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVEST_REC_PREMIUM_RECEIVE";
    payload: number | null;
};

type RoaInvestInputRetirementPolicyRecurringPremiumReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_RET_REC_PREMIUM_RECEIVE";
    payload: number | null;
};

export type RoaInvestInputAction =
    | RoaInvestInputClientIdReceiveAction
    | RoaInvestInputConsultReasonReceiveAction
    | RoaInvestInputProductTypeIdsReceiveAction
    | RoaInvestInputCompanyIdsReceiveAction
    | RoaInvestInputFundsReceiveAction
    | RoaInvestInputAdvisorRecommendationReceiveAction
    | RoaInvestInputInvestmentLumpsumReceiveAction
    | RoaInvestInputInvestmentRecurringPremiumReceiveAction
    | RoaInvestInputRetirementPolicyRecurringPremiumReceiveAction;

export const receiveClientId = (clientId: string | null): RoaInvestInputClientIdReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE",
    payload: clientId,
});

export const receiveConsultReason = (reason: string): RoaInvestInputConsultReasonReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE",
    payload: reason,
});

export const receiveProductTypeIds = (
    productTypeIds: string[]
): RoaInvestInputProductTypeIdsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_PRODUCTTYPEIDS_RECEIVE",
    payload: productTypeIds,
});

export const receiveCompanyIds = (companyIds: string[]): RoaInvestInputCompanyIdsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_COMPANYIDS_RECEIVE",
    payload: companyIds,
});

export const receiveFunds = (funds: string[]): RoaInvestInputFundsReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_FUNDS_RECEIVE",
    payload: funds,
});

export const receiveAdvisorRecommendation = (
    recommendation: string
): RoaInvestInputAdvisorRecommendationReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_ADVISOR_RECOMMENDATION_RECEIVE",
    payload: recommendation,
});

export const receiveInvestmentRecurringPremium = (
    premium: number | null
): RoaInvestInputInvestmentRecurringPremiumReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVEST_REC_PREMIUM_RECEIVE",
    payload: premium,
});

export const receiveInvestmentLumpsum = (
    lumpsum: number | null
): RoaInvestInputInvestmentLumpsumReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_INVEST_LUMPSUM_RECEIVE",
    payload: lumpsum,
});

export const receiveRetirementPolicyRecurringPremium = (
    premium: number | null
): RoaInvestInputRetirementPolicyRecurringPremiumReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_RET_REC_PREMIUM_RECEIVE",
    payload: premium,
});
