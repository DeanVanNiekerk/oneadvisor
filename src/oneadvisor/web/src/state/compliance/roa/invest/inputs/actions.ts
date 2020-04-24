type RoaInvestInputClientIdReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE";
    payload: string | null;
};

type RoaInvestInputConsultReasonReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE";
    payload: string;
};

export type RoaInvestInputAction =
    | RoaInvestInputClientIdReceiveAction
    | RoaInvestInputConsultReasonReceiveAction;

export const receiveClientId = (clientId: string | null): RoaInvestInputClientIdReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE",
    payload: clientId,
});

export const receiveConsultReason = (reason: string): RoaInvestInputConsultReasonReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE",
    payload: reason,
});
