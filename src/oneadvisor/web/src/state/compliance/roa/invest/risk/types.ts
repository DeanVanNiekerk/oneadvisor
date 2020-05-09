export type RoaInvestRiskState = {
    readonly riskProfileCaptureMode: RiskProfileCaptureMode;
    readonly riskProfileQuestions: RiskProfileQuestion[];
    readonly riskProfileQuestionAnswers: RiskProfileQuestionAnswers;
};

export type RiskProfileCaptureMode = "questionaire" | "manual";

export type RiskProfileQuestionAnswers = {
    //QuestionCode: AnswerCode
    [key in string]: string | null;
};

export type RiskProfileQuestion = {
    code: string;
    text: string;
    answers: RiskProfileAnswer[];
};

export type RiskProfileAnswer = {
    text: string;
    code: string;
    points: number;
};
