import React from "react";

import { Text, View } from "@react-pdf/renderer";

import { styles } from "./";

type Props = {
    fieldName: string;
    values: string[];
};

const FieldValues: React.FC<Props> = ({ fieldName, values }) => {
    if (values.length === 0) return <React.Fragment />;

    return (
        <View wrap={false}>
            <View style={[styles.b, styles.mb2]}>
                <Text>{fieldName}</Text>
            </View>
            <View style={styles.mb3}>
                {values.map((value) => (
                    <Text style={[styles.pl2, styles.mb1]} key={value}>
                        {value}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export { FieldValues };
