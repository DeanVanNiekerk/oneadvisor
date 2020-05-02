import React from "react";

import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";
import { Text, View } from "@react-pdf/renderer";

import { styles } from "../common";

type Props = {
    data: RoaInvestData;
};

const Signatures: React.FC<Props> = ({ data }) => {
    const rightMargin = 100;
    const signatureHeight = 120;

    return (
        <View wrap={false}>
            <View style={[styles.row]}>
                <View
                    style={[
                        styles.flex1,
                        {
                            borderBottomWidth: 1,
                            marginRight: rightMargin,
                            marginTop: signatureHeight,
                        },
                    ]}
                ></View>
                <View
                    style={[
                        styles.flex1,
                        {
                            borderBottomWidth: 1,
                            marginRight: rightMargin,
                            marginTop: signatureHeight,
                        },
                    ]}
                ></View>
            </View>
            <View style={[styles.row, styles.mt1]}>
                <View
                    style={[
                        styles.flex1,
                        {
                            marginRight: rightMargin,
                        },
                    ]}
                >
                    <Text>{data.clientFullName}</Text>
                </View>
                <View
                    style={[
                        styles.flex1,
                        {
                            marginRight: rightMargin,
                        },
                    ]}
                >
                    <Text>{data.userFullName}</Text>
                </View>
            </View>
        </View>
    );
};

export { Signatures };
