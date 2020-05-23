import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { FieldValue, Paragraph, styles } from "../common";
import { substituteText } from "../utils";

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
            text = `With the information you provided me, we have calculated that you would require a present day value income of ${data.needMonthly} per month`;

            if (data.needLumpsum) {
                text = `${text} and you have stipulated that you would require a once off present day value lumpsum of ${data.needLumpsum}`;

                if (data.retirementAge) {
                    text = `${text}, at age ${data.retirementAge}`;
                }
            }

            text = `${text}.`;
        }

        return text;
    };

    const riskExpectations = () => {
        return "Your expectations of return on investment needs to align to your risk profile. If you have a higher tolerance of risk and expectations of higher returns, you should expect volatility in your portfolio.  However, if you have a lower tolerance towards risk you need to have a lower expectation of outperforming inflation over the long term.";
    };

    const riskUnderstanding = () => {
        let text = "";

        text = `After discussing your tolerance and understanding of risk`;

        if (data.clientYearsToRetirement) {
            text = `${text}, and considering you are ${data.clientYearsToRetirement} years from retirement`;
        }

        text = `${text}, your risk profile is assessed as a ${data.riskProfileName}.`;

        if (data.rateOfReturn) {
            text = `${text} In our calculations we have set your expectation of returns at ${data.rateOfReturn}.`;
        }

        return text;
    };

    const contributionText = () => {
        let text = "";

        if (data.contributionMonthly) {
            text = `Considering all of the above, in addition to any current savings you may have, you are required to be saving ${data.contributionMonthly} per month`;

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
            <Paragraph value={substituteText(data.consultReason, data)} />
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
