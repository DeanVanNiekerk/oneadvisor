import { RiskProfileCaptureMode, RiskProfileQuestionAnswers } from "./types";

type RoaInvestDataRiskProfileQuestionAnswersReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_RISK_QUESTIONANSWERS_RECEIVE";
    payload: RiskProfileQuestionAnswers;
};

type RoaInvestDataRiskProfileCaptureModeReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_RISK_CAPTUREMODE_RECEIVE";
    payload: RiskProfileCaptureMode;
};

export type RoaInvestRiskAction =
    | RoaInvestDataRiskProfileQuestionAnswersReceiveAction
    | RoaInvestDataRiskProfileCaptureModeReceiveAction;

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
