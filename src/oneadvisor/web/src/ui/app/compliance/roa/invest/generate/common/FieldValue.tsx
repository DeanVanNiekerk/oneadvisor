import React from "react";

import { Text, View } from "@react-pdf/renderer";

import { styles } from "./";

type Props = {
    fieldName: string;
    value: string;
    mode?: "horizonal" | "vertical";
};

const FieldValue: React.FC<Props> = ({ fieldName, value, mode }) => {
    if (!value) return <React.Fragment />;

    if (mode === "vertical")
        return (
            <View style={styles.mb3}>
                <Text style={styles.b}>{fieldName}: </Text>
                <Text>{value}</Text>
            </View>
        );

    return (
        <View style={styles.mb3}>
            <Text>
                <Text style={styles.b}>{fieldName}: </Text>
                {value}
            </Text>
        </View>
    );
};

export { FieldValue };
