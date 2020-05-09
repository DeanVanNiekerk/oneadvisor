import React from "react";

import { Text, View } from "@react-pdf/renderer";

import { styles } from "./";

type Props = {
    value: string;
};

const Paragraph: React.FC<Props> = ({ value }) => {
    if (!value) return <React.Fragment />;

    return (
        <View style={styles.mb3}>
            <Text>{value}</Text>
        </View>
    );
};

export { Paragraph };
