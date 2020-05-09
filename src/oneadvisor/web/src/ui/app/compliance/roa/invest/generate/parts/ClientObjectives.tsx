import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { FieldValue, Paragraph, styles } from "../common";

type Props = {
    data: RoaInvestData;
};

const ClientObjectives: React.FC<Props> = ({ data }) => {
    const retirementAgeText = () => {
        let text = "";

        if (data.retirementAge) {
            text = `You are currently ${data.clientAge} years old and you plan to retire at the age of ${data.retirementAge}.`;

            if (data.lifeExpectancy) {
                text = `${text} From our discussions we have planned to provide retirement income until age ${data.lifeExpectancy}`;
            }
        }

        return text;
    };

    const incomeText = () => {
        let text = "";

        if (data.needMonthly) {
            text = `After analysing your needs we worked out that you would require an income of ${data.needMonthly} per month`;

            if (data.needLumpsum) {
                text = `${text} and you have stipulated that you would like to have a capital sum of ${data.needLumpsum}`;
            }

            text = `${text}.`;
        }

        return text;
    };

    const riskExpectations = () => {
        return "Your expectations of investment returns needs to align to your risk profile. If you have high expectations you have to expect volatility in your portfolio over time, and if you have a low tolerance to risk the trade off for having a smoother ride  is that you need to have lower expectations of beating inflation and you must be prepared to contribute more to your plan.";
    };

    const riskUnderstanding = () => {
        let text = "";
        let riskProfile = "moderate investor";

        if (riskProfile) {
            text = `After discussing your attitude and understanding of risk`;

            if (data.clientYearsToRetirement) {
                text = `${text}, and considering you are ${data.clientYearsToRetirement} years from retirement`;
            }

            text = `${text}, your risk profile is assessed as a ${riskProfile}.`;

            if (data.rateOfReturn) {
                text = `${text} Your expectation of returns is ${data.rateOfReturn}.`;
            }
        }

        return text;
    };

    const contributionText = () => {
        let text = "";

        if (data.contributionMonthly) {
            text = `Considering all of the above you are required to be saving ${data.contributionMonthly} per month`;

            if (data.contributionLumpsum) {
                text = `${text}, or you are required to inject a lumpsum of ${data.contributionLumpsum} into your retirement plan`;
            }

            text = `${text}.`;
        }

        return text;
    };

    return (
        <>
            <View style={[styles.h3]}>
                <Text>Client Needs</Text>
            </View>
            <Paragraph value={data.consultReason} />
            <FieldValue fieldName="Type of Investment Advice" value={data.investmentAdviceType} />

            <Paragraph value={retirementAgeText()} />
            <Paragraph value={incomeText()} />
            <Paragraph value={riskExpectations()} />
            <Paragraph value={riskUnderstanding()} />
            <Paragraph value={contributionText()} />
        </>
    );
};

export { ClientObjectives };
