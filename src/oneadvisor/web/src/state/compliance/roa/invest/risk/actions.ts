import { RiskProfileCaptureMode, RiskProfileCode, RiskProfileQuestionAnswers } from "./types";

type RoaInvestDataRiskProfileQuestionAnswersReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_RISK_QUESTIONANSWERS_RECEIVE";
    payload: RiskProfileQuestionAnswers;
};

type RoaInvestDataRiskProfileCaptureModeReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_RISK_CAPTUREMODE_RECEIVE";
    payload: RiskProfileCaptureMode;
};

type RoaInvestDataRiskProfileCodeReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_RISK_RISKPROFILE_RECEIVE";
    payload: RiskProfileCode;
};

export type RoaInvestRiskAction =
    | RoaInvestDataRiskProfileQuestionAnswersReceiveAction
    | RoaInvestDataRiskProfileCaptureModeReceiveAction
    | RoaInvestDataRiskProfileCodeReceiveAction;

export const receiveQuestionAnswers = (
    questionAnswers: RiskProfileQuestionAnswers
): RoaInvestDataRiskProfileQuestionAnswersReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_RISK_QUESTIONANSWERS_RECEIVE",
    payload: questionAnswers,
});

export const receiveCaptureMode = (
    mode: RiskProfileCaptureMode
): RoaInvestDataRiskProfileCaptureModeReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_RISK_CAPTUREMODE_RECEIVE",
    payload: mode,
});

export const receiveRiskProfileCode = (
    code: RiskProfileCode
): RoaInvestDataRiskProfileCodeReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_RISK_RISKPROFILE_RECEIVE",
    payload: code,
});
