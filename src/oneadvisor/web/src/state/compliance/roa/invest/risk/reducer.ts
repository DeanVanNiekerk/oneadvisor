import { RoaInvestRiskAction } from "./";
import { getRiskProfileQuestions } from "./questions";
import { RoaInvestRiskState } from "./types";

export const defaultState: RoaInvestRiskState = {
    riskProfileCaptureMode: "questionaire",
    riskProfileQuestions: getRiskProfileQuestions(),
    riskProfileQuestionAnswers: {},
    riskProfileCode: "moderate",
};

export const reducer = (state: RoaInvestRiskState = defaultState, action: RoaInvestRiskAction) => {
    switch (action.type) {
        case "COMPLIANCE_ROA_INVEST_RISK_QUESTIONANSWERS_RECEIVE": {
            return {
                ...state,
                riskProfileQuestionAnswers: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_RISK_CAPTUREMODE_RECEIVE": {
            return {
                ...state,
                riskProfileCaptureMode: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_RISK_RISKPROFILE_RECEIVE": {
            return {
                ...state,
                riskProfileCode: action.payload,
            };
        }
        default:
            return state;
    }
};
