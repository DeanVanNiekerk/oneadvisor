import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { FieldValues, styles } from "../common";
import { substituteText } from "../utils";

type Props = {
    data: RoaInvestData;
};

const AdvisorRecommendation: React.FC<Props> = ({ data }) => {
    return (
        <>
            <View wrap={false}>
                {/* Keep header and first section together */}
                <View style={[styles.h3]}>
                    <Text>Advisor Recommendation</Text>
                </View>
                <FieldValues
                    fieldName="Products Recommended"
                    values={data.recommendedProductTypes}
                />
            </View>

            <FieldValues fieldName="Companies Recommended" values={data.recommendedCompanies} />
            <FieldValues fieldName="Funds Recommended" values={data.recommendedFunds} />

            <View style={styles.mb3}>
                <Text>{substituteText(data.recommendedAction, data)}</Text>
            </View>
        </>
    );
};

export { AdvisorRecommendation };
