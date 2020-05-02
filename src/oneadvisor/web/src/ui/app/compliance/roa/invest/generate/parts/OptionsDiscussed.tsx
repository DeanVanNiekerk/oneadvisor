import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { FieldValues, styles } from "../common";

type Props = {
    data: RoaInvestData;
};

const OptionsDiscussed: React.FC<Props> = ({ data }) => {
    return (
        <>
            <View wrap={false}>
                {/* Keep header and first section together */}
                <View style={[styles.h3]}>
                    <Text>Options Discussed</Text>
                </View>
                <FieldValues fieldName="Products Considered" values={data.discussedProductTypes} />
            </View>

            <FieldValues fieldName="Companies Considered" values={data.discussedCompanies} />
            <FieldValues fieldName="Funds Considered" values={data.discussedFunds} />
        </>
    );
};

export { OptionsDiscussed };
