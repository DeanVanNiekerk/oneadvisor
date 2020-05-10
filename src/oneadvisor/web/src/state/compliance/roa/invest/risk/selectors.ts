import { createSelector } from "reselect";

import { RootState } from "@/state";

import {
    RiskProfileCaptureMode,
    RiskProfileCode,
    RiskProfileQuestion,
    RiskProfileQuestionAnswers,
    RoaInvestRiskState,
} from "./types";

const rootSelector = (state: RootState): RoaInvestRiskState => state.compliance.roa.invest.risk;

export const roaInvestRiskSelector: (state: RootState) => RoaInvestRiskState = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);

export const roaInvestRiskQuestionsSelector: (
    state: RootState
) => RiskProfileQuestion[] = createSelector(rootSelector, (root) => {
    return root.riskProfileQuestions;
});

export const roaInvestRiskQuestionAnswersSelector: (
    state: RootState
) => RiskProfileQuestionAnswers = createSelector(rootSelector, (root) => {
    return root.riskProfileQuestionAnswers;
});

export const roaInvestRiskCaptureModeSelector: (
    state: RootState
) => RiskProfileCaptureMode = createSelector(rootSelector, (root) => {
    return root.riskProfileCaptureMode;
});

export const roaInvestRiskProfileCodeSelector: (
    state: RootState
) => RiskProfileCode = createSelector(rootSelector, (root) => {
    return root.riskProfileCode;
});

export const roaInvestRiskProfileScoreSelector: (state: RootState) => number = createSelector(
    roaInvestRiskQuestionsSelector,
    roaInvestRiskQuestionAnswersSelector,
    (riskProfileQuestions, questionAnswers) => {
        let score = 0;
        riskProfileQuestions.forEach((q) => {
            q.answers.forEach((a) => {
                if (questionAnswers[q.code] === a.code) score += a.points;
            });
        });
        return score;
    }
);

export const roaInvestRiskQuestionAnswerCodesSelector: (
    state: RootState
) => string[] = createSelector(roaInvestRiskQuestionAnswersSelector, (questionAnswers) => {
    return Object.keys(questionAnswers)
        .map((key) => {
            return questionAnswers[key];
        })
        .filter((answerCode) => {
            return !!answerCode;
        }) as string[];
});

export const roaInvestCalculatedRiskProfileCodeSelector: (
    state: RootState
) => RiskProfileCode = createSelector(
    roaInvestRiskProfileScoreSelector,
    roaInvestRiskCaptureModeSelector,
    roaInvestRiskProfileCodeSelector,
    (score, captureMode, riskProfileCode) => {
        if (captureMode === "manual") return riskProfileCode;

        if (score <= 224) return "conservative";

        if (score <= 374) return "moderately_conservative";

        if (score <= 524) return "moderate";

        return "moderately_aggressive";
    }
);
