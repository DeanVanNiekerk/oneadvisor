import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { FieldValue, styles } from "../common";

type Props = {
    data: RoaInvestData;
};

const ClientObjectives: React.FC<Props> = ({ data }) => {
    return (
        <>
            <View style={[styles.h3]}>
                <Text>Client Needs</Text>
            </View>
            <View style={styles.mb3}>
                <Text>{data.consultReason}</Text>
            </View>
            <FieldValue fieldName="Type of Investment Advice" value={data.investmentAdviceType} />
            <FieldValue fieldName="Monthly Need" value={data.needMonthly} />
            <FieldValue fieldName="Lumpsum Need" value={data.needLumpsum} />
            <FieldValue fieldName="Monthly Contribution" value={data.contributionMonthly} />
            <FieldValue fieldName="Lumpsum Contribution" value={data.contributionLumpsum} />
        </>
    );
};

export { ClientObjectives };
