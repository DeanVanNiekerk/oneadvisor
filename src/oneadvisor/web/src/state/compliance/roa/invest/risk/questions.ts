import { RiskProfileQuestion } from "./types";

export const getRiskProfileQuestions = (): RiskProfileQuestion[] => {
    return [
        {
            text: "In approximately how many years do you expect to retire?",
            code: "retire",
            answers: [
                {
                    code: "retire_1",
                    text: "Within 3 years",
                    points: 75,
                },
                {
                    code: "retire_2",
                    text: "Between 3 - 5 years",
                    points: 150,
                },
                {
                    code: "retire_3",
                    text: "More than 5 years",
                    points: 200,
                },
            ],
        },
        {
            text: "What portion of your total retirement funds does this investment represent?",
            code: "portion",
            answers: [
                {
                    code: "portion_1",
                    text: "Less than 25%",
                    points: 200,
                },
                {
                    code: "portion_2",
                    text: "25% - 50%",
                    points: 150,
                },
                {
                    code: "portion_3",
                    text: "50% - 75%",
                    points: 100,
                },
                {
                    code: "portion_4",
                    text: "More than 75%",
                    points: 50,
                },
            ],
        },
        {
            text:
                "Avoiding losses in my investment portfolio during any one year period is more important than earning returns in excess of average money market rates.",
            code: "avoiding",
            answers: [
                {
                    code: "avoiding_1",
                    text: "Strongly agree",
                    points: 10,
                },
                {
                    code: "avoiding_2",
                    text: "Agree",
                    points: 18,
                },
                {
                    code: "avoiding_3",
                    text: "Neutral",
                    points: 26,
                },
                {
                    code: "avoiding_4",
                    text: "Disagree",
                    points: 32,
                },
                {
                    code: "avoiding_5",
                    text: "Strongly disagree",
                    points: 40,
                },
            ],
        },
        {
            text: "I am a long-term investor. Short-term losses can be tolerated.",
            code: "longterm",
            answers: [
                {
                    code: "longterm_1",
                    text: "Strongly agree",
                    points: 40,
                },
                {
                    code: "longterm_2",
                    text: "Agree",
                    points: 32,
                },
                {
                    code: "longterm_3",
                    text: "Neutral",
                    points: 26,
                },
                {
                    code: "longterm_4",
                    text: "Disagree",
                    points: 18,
                },
                {
                    code: "longterm_5",
                    text: "Strongly disagree",
                    points: 10,
                },
            ],
        },
        {
            text:
                "Beating inflation over the long term is more important to me than short-term stable returns.",
            code: "inflation",
            answers: [
                {
                    code: "inflation_1",
                    text: "Strongly agree",
                    points: 40,
                },
                {
                    code: "inflation_2",
                    text: "Agree",
                    points: 32,
                },
                {
                    code: "inflation_3",
                    text: "Neutral",
                    points: 26,
                },
                {
                    code: "inflation_4",
                    text: "Disagree",
                    points: 18,
                },
                {
                    code: "inflation_5",
                    text: "Strongly disagree",
                    points: 10,
                },
            ],
        },
        {
            text:
                "If you could increase your chances of improving your returns by taking more risk, would you:",
            code: "improving",
            answers: [
                {
                    code: "improving_1",
                    text: "Be willing to take a lot more risk with your entire investment?",
                    points: 80,
                },
                {
                    code: "improving_2",
                    text: "Be willing to take a lot more risk with a portion of your investment?",
                    points: 64,
                },
                {
                    code: "improving_3",
                    text: "Be willing to take a little more risk with your entire investment?",
                    points: 52,
                },
                {
                    code: "improving_4",
                    text:
                        "Be willing to take a little more risk with a portion of your investment?",
                    points: 36,
                },
                {
                    code: "improving_5",
                    text: "Be unlikely to take any investment risk?",
                    points: 20,
                },
            ],
        },
    ];
};
