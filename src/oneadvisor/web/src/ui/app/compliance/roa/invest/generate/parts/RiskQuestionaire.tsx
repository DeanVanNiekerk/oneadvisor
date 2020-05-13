import React from "react";

import { RiskAnswer, RiskQuestion, RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { RiskProfileCode } from "@/state/compliance/roa/invest/risk/types";
import ReactPDF, { Canvas, StyleSheet, Text, View } from "@react-pdf/renderer";

import { styles as commonStyles } from "../common";

export const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: 12,
    },
    question: {
        paddingBottom: 8,
    },
    answer: {
        paddingBottom: 6,
    },
});

type Props = {
    questions: RiskQuestion[];
};

const RiskQuestionaire: React.FC<Props> = ({ questions }) => {
    return (
        <View>
            {questions.map((question) => {
                return (
                    <View wrap={false} key={question.text} style={styles.wrapper}>
                        <View style={[commonStyles.b, styles.question]}>
                            <Text>{question.text}</Text>
                        </View>
                        <Answers answers={question.answers} />
                    </View>
                );
            })}
        </View>
    );
};

type AnswersProps = {
    answers: RiskAnswer[];
};

const Answers: React.FC<AnswersProps> = ({ answers }) => {
    return (
        <>
            {answers.map((answer) => {
                return (
                    <>
                        {answer.isSelected && (
                            <View style={styles.answer}>
                                <Text>{`> ${answer.text}`}</Text>
                            </View>
                        )}
                        {!answer.isSelected && (
                            <View style={[styles.answer, { paddingLeft: 8, color: "#676767" }]}>
                                <Text>{answer.text}</Text>
                            </View>
                        )}
                    </>
                );
            })}
        </>
    );
};

export { RiskQuestionaire };
