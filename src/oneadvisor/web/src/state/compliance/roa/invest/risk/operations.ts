import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { RootState } from "@/state/types";

import { receiveQuestionAnswers, roaInvestRiskQuestionAnswersSelector } from "./";

export const riskProfileQuestionAnswered = (
    questionCode: string,
    answerCode: string,
    active: boolean
): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        const questionAnswers = roaInvestRiskQuestionAnswersSelector(getState());
        const updated = {
            ...questionAnswers,
            [questionCode]: active ? answerCode : null,
        };
        dispatch(receiveQuestionAnswers(updated));
    };
};
