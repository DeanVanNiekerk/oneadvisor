import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { RiskProfileCode } from "@/state/compliance/roa/invest/risk/types";
import ReactPDF, { StyleSheet, Text, View } from "@react-pdf/renderer";

import { styles as commonStyles } from "../common";
import { RiskQuestionaire } from "./RiskQuestionaire";

export const styles = StyleSheet.create({
    scoreCol: {
        width: 75,
        borderWidth: 1,
        justifyContent: "center",
        textAlign: "center",
        padding: 10,
    },
    profileCol: {
        width: 100,
        justifyContent: "center",
        textAlign: "center",
        padding: 10,
        borderWidth: 1,
    },
    descriptionCol: {
        width: 100,
        justifyContent: "center",
        textAlign: "center",
        padding: 10,
        borderWidth: 1,
    },
    pointsCol: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
    },
    mb2: {
        marginBottom: 2,
    },
    activeRow: {
        backgroundColor: "#d1d1d1",
    },
});

type Props = {
    data: RoaInvestData;
};

const Risk: React.FC<Props> = ({ data }) => {
    const getRowStyle = (riskProfileCode: RiskProfileCode): ReactPDF.Style[] => {
        const rowStyles = [commonStyles.row];

        if (data.riskProfileCode === riskProfileCode) rowStyles.push(styles.activeRow);

        return rowStyles;
    };

    return (
        <View>
            <View style={[commonStyles.h3]}>
                <Text>Risk Profile</Text>
            </View>

            <View>
                <RiskQuestionaire questions={data.riskQuestions} />
            </View>

            <View wrap={false}>
                {data.riskScore != null && (
                    <View style={commonStyles.mb3}>
                        <Text style={[commonStyles.h4]}>
                            Your risk score: <Text style={[commonStyles.b]}>{data.riskScore}</Text>
                        </Text>
                    </View>
                )}

                <View style={getRowStyle("conservative")}>
                    <View style={styles.scoreCol}>
                        <Text>0 - 224</Text>
                    </View>
                    <View style={styles.profileCol}>
                        <Text>Conservative</Text>
                    </View>
                    <View style={styles.descriptionCol}>
                        <Text>Aim for secure income stream</Text>
                    </View>
                    <View style={styles.pointsCol}>
                        <View style={styles.mb2}>
                            <Text>Aim for secure income stream.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>No protection against unexpected inflation.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>Minimal growth on the capital invested.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>Aim for short to medium-term preservation of capital.</Text>
                        </View>
                        <View>
                            <Text>May not be fully tax efficient.</Text>
                        </View>
                    </View>
                </View>

                <View style={getRowStyle("moderately_conservative")}>
                    <View style={styles.scoreCol}>
                        <Text>225 - 374</Text>
                    </View>
                    <View style={styles.profileCol}>
                        <Text>Moderately Conservative</Text>
                    </View>
                    <View style={styles.descriptionCol}>
                        <Text>Guarantees / Defence</Text>
                    </View>
                    <View style={styles.pointsCol}>
                        <View style={styles.mb2}>
                            <Text>
                                Aim for stable income stream, with some protection against
                                unexpected inflation.
                            </Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>Aim for modest growth on the capital invested.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>Aim for medium to long-term capital security.</Text>
                        </View>
                        <View>
                            <Text>May not be fully tax efficient.</Text>
                        </View>
                    </View>
                </View>

                <View style={getRowStyle("moderate")}>
                    <View style={styles.scoreCol}>
                        <Text>375 - 524</Text>
                    </View>
                    <View style={styles.profileCol}>
                        <Text>Moderate</Text>
                    </View>
                    <View style={styles.descriptionCol}>
                        <Text>Defence</Text>
                    </View>
                    <View style={styles.pointsCol}>
                        <View style={styles.mb2}>
                            <Text>Aim for moderate income stream.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>Aim for long-term return greater than inflation.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>Aim for modest growth on capital invested.</Text>
                        </View>
                        <View>
                            <Text>May be exposed to a moderate level of capital volatility.</Text>
                        </View>
                    </View>
                </View>

                <View style={getRowStyle("moderately_aggressive")}>
                    <View style={styles.scoreCol}>
                        <Text>525 +</Text>
                    </View>
                    <View style={styles.profileCol}>
                        <Text>Moderately Aggressive</Text>
                    </View>
                    <View style={styles.descriptionCol}>
                        <Text>Defence / Market Growth</Text>
                    </View>
                    <View style={styles.pointsCol}>
                        <View style={styles.mb2}>
                            <Text>Aim for long-term return greater than inflation.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>May have modest income stream.</Text>
                        </View>
                        <View style={styles.mb2}>
                            <Text>Aim for high level of long-term growth on capital invested.</Text>
                        </View>
                        <View>
                            <Text>High volatility of capital invested.</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={[commonStyles.mt4, { lineHeight: 1.5 }]}>
                <Text>
                    {`This risk profile is used to assist us in advising you on an appropriate investment portfolio. The profile is not intended to offer any guarantee. No representation, guarantee or warranty is made by ${data.userOrganisationName} as to the performance or investment returns of the underlying investment options selected by the client, and ${data.userOrganisationName} accepts no responsibility or liability for any direct, indirect or consequential loss arising from the investment in the underlying investment options selected by the client. Past performance is not necessarily a guide to the future and investors may not get back the full amount invested. This assessment is built on the theoretical correlation between risk tolerance and investment term, liquidity needs and attitude towards risk. Should the client not feel comfortable with the outcome of this assessment your specific requirements should take precedence.`}
                </Text>
            </View>
        </View>
    );
};

export { Risk };
