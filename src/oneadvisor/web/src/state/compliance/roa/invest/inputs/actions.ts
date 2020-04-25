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

export type RoaInvestInputAction =
    | RoaInvestInputClientIdReceiveAction
    | RoaInvestInputConsultReasonReceiveAction
    | RoaInvestInputProductTypeIdsReceiveAction
    | RoaInvestInputCompanyIdsReceiveAction;

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
