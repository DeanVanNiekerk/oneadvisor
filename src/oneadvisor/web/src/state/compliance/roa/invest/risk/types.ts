export type RoaInvestRiskState = {
    readonly riskProfileCaptureMode: RiskProfileCaptureMode;
    readonly riskProfileQuestions: RiskProfileQuestion[];
    readonly riskProfileQuestionAnswers: RiskProfileQuestionAnswers;
    readonly riskProfileCode: RiskProfileCode;
};

export type RiskProfileCaptureMode = "questionaire" | "manual";
export type RiskProfileCode =
    | "conservative"
    | "moderately_conservative"
    | "moderate"
    | "moderately_aggressive";

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
