import React from "react";

import { RiskAnswer, RiskQuestion } from "@/state/compliance/roa/invest/data/types";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

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
                    <React.Fragment key={answer.text}>
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
                    </React.Fragment>
                );
            })}
        </>
    );
};

export { RiskQuestionaire };
