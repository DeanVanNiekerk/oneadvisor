import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { styles } from "../common";

type Props = {
    data: RoaInvestData;
};

const ClientChoice: React.FC<Props> = ({ data }) => {
    return (
        <View wrap={false}>
            <View style={[styles.h3]}>
                <Text>Client Choice</Text>
            </View>

            <View style={styles.mb3}>
                <Text>{data.clientChoice}</Text>
            </View>
        </View>
    );
};

export { ClientChoice };
