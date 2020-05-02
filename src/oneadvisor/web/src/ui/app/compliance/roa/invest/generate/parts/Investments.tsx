import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { Splitter, styles } from "../common";
import { Investment } from "./";

type Props = {
    data: RoaInvestData;
};

const Investments: React.FC<Props> = ({ data }) => {
    return (
        <>
            <View style={[styles.h3]}>
                <Text>Investments Implemented</Text>
            </View>

            {data.investments.map((investment) => (
                <View key={investment.number} style={[styles.mb2]}>
                    <Investment investment={investment} />
                    <Splitter />
                </View>
            ))}
        </>
    );
};

export { Investments };
