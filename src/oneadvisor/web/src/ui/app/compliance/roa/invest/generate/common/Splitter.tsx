import React from "react";

import { View } from "@react-pdf/renderer";

const Splitter: React.FC = () => {
    return (
        <View
            style={{
                borderBottomWidth: 1,
                borderBottomColor: "#D3D3D3",
                borderBottomStyle: "solid",
                marginHorizontal: 28,
                marginVertical: 18,
            }}
        ></View>
    );
};

export { Splitter };
